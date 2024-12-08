from flask_socketio import SocketIO, emit
import cv2
import face_recognition
import pickle
import numpy as np
import base64
import time
import os
import dlib
from imutils import face_utils
from sklearn import neighbors
import threading
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_socketio import SocketIO
from db import db, init_db, User, Community  # Import from db.py
from functools import wraps
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    decode_token,
)
import requests
import re
from transformers import pipeline
import datetime
from PIL import Image


pipe = pipeline(task="depth-estimation", model="LiheYoung/depth-anything-small-hf")


def load_yolo_model():

    weights_path = "models/yolov3.weights"
    config_path = "models/yolov3.cfg"

    net = cv2.dnn.readNet(weights_path, config_path)
    layer_names = net.getLayerNames()
    output_layer_indices = net.getUnconnectedOutLayers()
    output_layers = [layer_names[i - 1] for i in output_layer_indices.flatten()]

    return net, output_layers


def load_labels():
    with open("models/coco.names", "r") as f:
        labels = f.read().strip().split("\n")
    return labels


def process_frame(frame):
    height, width = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(
        frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False
    )
    return blob, height, width


def get_predictions(net, output_layers, blob):
    net.setInput(blob)
    outs = net.forward(output_layers)
    return outs


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=60, ping_interval=25)
bcrypt = Bcrypt(app)
CORS(app)
app.config.from_object("config.Config")
jwt = JWTManager(app)
init_db(app)

# Load the KNN model


def jwt_protected_socket_event(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Get the JWT token from the socket handshake (connection) parameters
        token = request.args.get("token")

        if not token:
            emit("error", {"error": "Missing authentication token"})
            return

        try:
            print("Token:", token)
            # Decode the token and verify its validity
            data = decode_token(encoded_token=token)
            print("Decoded token:", data)

            if not data:
                emit("error", {"error": "Invalid or expired token"})
                return

            kwargs["user_data"] = data["sub"]

            return func(*args, **kwargs)
        except Exception as e:
            print("Error decoding token:", e)
            emit("error", {"error": "Invalid or expired token"})
            return

    return wrapper


model_path = "models/trained_knn_model.clf"
knn_clf = None

if not os.path.exists(model_path):
    print("Error: Model file not found")
else:
    with open("models/trained_knn_model.clf", "rb") as f:
        knn_clf = pickle.load(f)

# Global dictionary to track image counts per person
person_image_counts = {}
# Lock for thread-safe operations
model_lock = threading.Lock()

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


@socketio.on("video_frame")
@jwt_protected_socket_event
def handle_video_frame(data, user_data):
    try:

        if knn_clf is None:
            print("Model not trained yet!")
            emit("error", {"error": "Model not trained yet!"})
            return

        start_time = time.time()
        if not data:
            emit("error", {"error": "No data received"})
            return

        print("User identity:", user_data)

        # Decode and resize image
        img_data = base64.b64decode(data)
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            emit("error", {"error": "Invalid frame provided"})
            return

        # Resize image
        scale_percent = 25
        width = int(frame.shape[1] * scale_percent / 100)
        height = int(frame.shape[0] * scale_percent / 100)
        frame = cv2.resize(frame, (width, height))

        # Convert color space
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Face detection and encoding
        face_locations = face_recognition.face_locations(rgb_frame, model="hog")
        face_encodings = face_recognition.face_encodings(
            rgb_frame, face_locations, num_jitters=1
        )

        results = []
        scale_factor = 100 / scale_percent
        threshold = 0.8

        for face_encoding, (top, right, bottom, left) in zip(
            face_encodings, face_locations
        ):
            # Adjust coordinates
            top = int(top * scale_factor)
            right = int(right * scale_factor)
            bottom = int(bottom * scale_factor)
            left = int(left * scale_factor)

            # KNN prediction
            closest_distances, _ = knn_clf.kneighbors([face_encoding], n_neighbors=1)
            prediction = knn_clf.predict([face_encoding])[0]
            distance = closest_distances[0][0]
            if distance < threshold:
                prediction = knn_clf.predict([face_encoding])[0]
            else:
                prediction = "Unknown"

            results.append(
                {
                    "name": prediction,
                    "distance": float(distance),
                    "location": {
                        "top": top,
                        "right": right,
                        "bottom": bottom,
                        "left": left,
                    },
                }
            )

        processing_time = time.time() - start_time
        print(f"Processing time: {processing_time:.2f} seconds")
        emit("face_recognition_result", results)
    except Exception as e:
        print("Error processing video frame:", e)
        emit("error", {"error": "An error occurred while processing the video frame"})


@socketio.on("add_person")
@jwt_protected_socket_event
def handle_add_person(data, user_data):
    print("Add person request received")
    try:
        start_time = time.time()
        if not data:
            print("No data received")
            emit("error", {"error": "No data received"})
            return

        name = data.get("name")
        frame_data = data.get("frame")
        print("Adding person:", name)
        print("Frame data received:", len(frame_data))

        if not name or not frame_data:
            emit("error", {"error": "Name or frame data not provided"})
            return

        # Initialize count for this person if not already
        if name not in person_image_counts:
            person_image_counts[name] = 0

        # Decode the image
        img_data = base64.b64decode(frame_data)
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            emit("error", {"error": "Invalid frame provided"})
            return

        # Process the frame
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces using dlib's face detector
        detector = dlib.get_frontal_face_detector()
        rects = detector(gray, 1)

        # For each face detected
        for rect in rects:
            (x, y, w, h) = face_utils.rect_to_bb(rect)
            cropped_face = frame[y : y + h, x : x + w]
            resized_face = cv2.resize(cropped_face, (108, 108))

            # Create the folder if it does not exist
            folder_name = os.path.join("dataset", name)
            os.makedirs(folder_name, exist_ok=True)

            # Save the image
            image_count = person_image_counts[name]
            image_filename = os.path.join(folder_name, f"{image_count}.jpg")
            cv2.imwrite(image_filename, resized_face)
            person_image_counts[name] += 1

            print(f"Image saved: {image_filename}")
            # Limit the number of images per person
            if person_image_counts[name] >= 10:
                print("Person added successfully!!")
                email = user_data.get("email")
                print("NICE User email:", email)
                # Add the contact name to the user's contacts list in the database
                user = User.query.filter_by(email=email).first()
                if user:
                    print("User contacts rn:", user.contacts)
                    if not isinstance(user.contacts, list):
                        user.contacts = []

                    if name not in user.contacts:
                        user.contacts.append(name)

                    update = User.query.filter_by(email=email).update(
                        {"contacts": user.contacts}
                    )
                    db.session.commit()

                    print(f"Contact {name} added to user {user.email} = {update}")

                # Retrain the model in a separate thread
                threading.Thread(target=retrain_model).start()
                emit(
                    "add_person_result",
                    {
                        "message": "Person added and model retrained",
                        "count": person_image_counts[name],
                    },
                )
                # Reset the count for the person
                del person_image_counts[name]
                return

        emit(
            "add_person_result",
            {"message": "Frame processed", "count": person_image_counts[name]},
        )
    except Exception as e:
        print("Error in add_person:", e)
        emit("error", {"error": "An error occurred while adding the person"})


@socketio.on("depth_detection_frame")
@jwt_protected_socket_event
def handle_depth_detection_frame(data, user_data):
    try:
        start_time = time.time()
        if not data:
            emit("error", {"error": "No data received"})
            return

        # Decode and resize image
        img_data = base64.b64decode(data)
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            emit("error", {"error": "Invalid frame provided"})
            return

        # Resize image
        scale_percent = 25
        width = int(frame.shape[1] * scale_percent / 100)
        height = int(frame.shape[0] * scale_percent / 100)
        frame = cv2.resize(frame, (width, height))

        # Process the frame for depth detection
        closest_region, closest_depth = process_frame_for_depth(frame)

        result = {"region": closest_region, "depth": closest_depth}

        # Emit the object detection results
        processing_time = time.time() - start_time
        print(f"Processing time: {processing_time:.2f} seconds")

        emit("depth_detection_result", result)
    except Exception as e:
        print("Error processing object detection frame:", e)
        emit(
            "error",
            {"error": "An error occurred while processing the object detection frame"},
        )


def retrain_model():
    with model_lock:
        try:
            print("Retraining the model...")
            train_dir = "dataset"
            encodings = []
            names = []

            # List of people in the dataset
            train_dir_list = os.listdir(train_dir)
            print("Persons in dataset:", train_dir_list)

            # Loop through each person in the training set
            for person in train_dir_list:
                person_folder = os.path.join(train_dir, person)
                if not os.path.isdir(person_folder):
                    continue

                # Loop through each image of the person
                for person_img in os.listdir(person_folder):
                    img_path = os.path.join(person_folder, person_img)
                    print("Processing image:", img_path)
                    face = face_recognition.load_image_file(img_path)

                    # Get image dimensions
                    height, width, _ = face.shape
                    face_location = (0, width, height, 0)

                    # Get face encodings
                    face_enc = face_recognition.face_encodings(
                        face, known_face_locations=[face_location]
                    )

                    if len(face_enc) == 0:
                        print(f"No face encodings found in image {img_path}")
                        continue

                    # Flatten the face encoding
                    face_enc = np.array(face_enc)
                    face_enc = face_enc.flatten()

                    encodings.append(face_enc)
                    names.append(person)

            print("Total encodings:", len(encodings))
            print("Total names:", len(names))

            # Set n_neighbors to 2 as in your train.py
            n_neighbors = 2

            # Create and train the KNN classifier
            knn_clf_new = neighbors.KNeighborsClassifier(
                n_neighbors=n_neighbors, algorithm="ball_tree", weights="distance"
            )
            knn_clf_new.fit(encodings, names)

            # Save the trained KNN classifier
            with open("models/trained_knn_model.clf", "wb") as f:
                pickle.dump(knn_clf_new, f)

            # Update the global knn_clf
            global knn_clf
            knn_clf = knn_clf_new
            print("Model retraining completed.")
        except Exception as e:
            print("Error retraining the model:", e)


def process_frame_for_depth(frame):
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    depth = pipe(image)["depth"]
    depth_np = np.array(depth)

    scaling_factor = 1 / 100.0
    absolute_depth = depth_np * scaling_factor

    height, width = absolute_depth.shape

    left_region = absolute_depth[:, : width // 3]
    center_region = absolute_depth[:, width // 3 : 2 * width // 3]
    right_region = absolute_depth[:, 2 * width // 3 :]
    top_region = absolute_depth[: height // 3, :]
    bottom_region = absolute_depth[2 * height // 3 :, :]

    threshold = np.percentile(absolute_depth, 20)

    large_object_mask_left = left_region < threshold
    large_object_mask_center = center_region < threshold
    large_object_mask_right = right_region < threshold
    large_object_mask_top = top_region < threshold
    large_object_mask_bottom = bottom_region < threshold

    nearest_left_depth = (
        left_region[large_object_mask_left].min()
        if np.any(large_object_mask_left)
        else np.inf
    )
    nearest_center_depth = (
        center_region[large_object_mask_center].min()
        if np.any(large_object_mask_center)
        else np.inf
    )
    nearest_right_depth = (
        right_region[large_object_mask_right].min()
        if np.any(large_object_mask_right)
        else np.inf
    )
    nearest_top_depth = (
        top_region[large_object_mask_top].min()
        if np.any(large_object_mask_top)
        else np.inf
    )
    nearest_bottom_depth = (
        bottom_region[large_object_mask_bottom].min()
        if np.any(large_object_mask_bottom)
        else np.inf
    )

    region_depths = {
        "left": nearest_left_depth,
        "center": nearest_center_depth,
        "right": nearest_right_depth,
        "top": nearest_top_depth,
        "bottom": nearest_bottom_depth,
    }

    closest_region = min(region_depths, key=region_depths.get)
    closest_depth = region_depths[closest_region]

    return closest_region, closest_depth


@socketio.on("object_detection_frame")
@jwt_protected_socket_event
def handle_object_detection_frame(data, user_data):
    try:
        print("Object detection request received")
        start_time = time.time()
        if not data:
            emit("error", {"error": "No data received"})
            return

        # Decode and resize image
        img_data = base64.b64decode(data)
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            emit("error", {"error": "Invalid frame provided"})
            return

        # Resize image
        scale_percent = 25
        width = int(frame.shape[1] * scale_percent / 100)
        height = int(frame.shape[0] * scale_percent / 100)
        frame = cv2.resize(frame, (width, height))

        # Load YOLO model and labels
        net, output_layers = load_yolo_model()
        labels = load_labels()

        # Convert the frame into a blob for YOLO
        blob, height, width = process_frame(frame)
        outs = get_predictions(net, output_layers, blob)

        detected_objects = []
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5:  # Threshold for detection
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    # Store the results
                    detected_objects.append(
                        str(labels[class_id]),
                        # "confidence": float(confidence),
                        # "location": {"x": x, "y": y, "width": w, "height": h},
                        # }
                    )

        # Emit the object detection results
        processing_time = time.time() - start_time
        print(f"Processing time: {processing_time:.2f} seconds")

        detected_objects_set = set(detected_objects)
        detected_objects = list(detected_objects_set)
        emit("object_detection_result", detected_objects)
    except Exception as e:
        print("Error processing object detection frame:", e)
        emit(
            "error",
            {"error": "An error occurred while processing the object detection frame"},
        )


@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    print(data)
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    if role not in ["user", "volunteer"]:
        return jsonify({"error": "Invalid role"}), 400

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # add regex for email validation
    regex = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

    if not re.match(regex, email):
        return jsonify({"error": "Invalid email"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password=hashed_password, name=name, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 200


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print(data)
    email = data.get("email")
    password = data.get("password")
    device_token = data.get("deviceToken")  # Get the device token from the request

    # add regex for email validation
    regex = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if not re.match(regex, email):
        return jsonify({"error": "Invalid email"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Update the user's device token in the database
    # if device_token:
    #     user.device_token = device_token
    #     db.session.commit()
    user.lastLogin = datetime.datetime.now()
    db.session.commit()

    access_token = create_access_token(
        identity={"email": user.email, "role": user.role}
    )
    return (
        jsonify({"token": access_token, "user": {"email": email, "role": user.role}}),
        200,
    )


@app.route("/status", methods=["GET"])
@jwt_required()
def status():
    try:
        identity = get_jwt_identity()

        if not identity:
            return jsonify({"error": "Invalid token"}), 401

        return (
            jsonify(
                {
                    "message": f"User {identity['email']} is logged in",
                    "role": identity["role"],
                    "email": identity["email"],
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401


@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Logged out successfully"}), 200


@app.route("/contacts", methods=["GET"])
@jwt_required()
def get_contacts():
    try:
        identity = get_jwt_identity()

        if not identity:
            return jsonify({"error": "Invalid token"}), 401

        user = User.query.filter_by(email=identity["email"]).first()

        print(user.contacts, user.email, user.role)
        if not user:
            return jsonify({"error": "User not found"}), 404

        contacts = user.contacts if user.contacts else []
        return jsonify({"contacts": contacts}), 200
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401


@app.route("/volunteer", methods=["POST"])
@jwt_required()
def volunteer():
    data = request.get_json()
    phoneNumber = data.get("phoneNumber")

    if not phoneNumber:
        return jsonify({"error": "Phone number is required"}), 400

    user_info = get_jwt_identity()

    email = user_info.get("email")
    role = user_info.get("role")

    if role != "volunteer":
        return jsonify({"error": "Only volunteers are allowed to add number"}), 403

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.phoneNumber = phoneNumber
    db.session.commit()

    return jsonify({"message": "User role updated to volunteer"}), 200


@app.route("/volunteer", methods=["GET"])
@jwt_required()
def get_volunteer():
    # last logged in volunteer
    user = (
        User.query.filter_by(role="volunteer").order_by(User.lastLogin.desc()).first()
    )

    if not user:
        return jsonify({"phoneNumber": "+919810705237"}), 200

    return jsonify({"phoneNumber": user.phoneNumber, "email": user.email}), 200


@app.route("/community", methods=["POST"])
@jwt_required()
def community():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    rating = data.get("rating")

    if not name or not description:
        return jsonify({"error": "Name and description are required"}), 400

    user_info = get_jwt_identity()

    email = user_info.get("email")
    role = user_info.get("role")

    if role != "volunteer":
        return (
            jsonify({"error": "Only volunteers are allowed to create communities"}),
            403,
        )

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_community = Community(
        name=name,
        description=description,
        rating=rating,
        timestamp=datetime.datetime.now(),
    )
    db.session.add(new_community)
    db.session.commit()

    return jsonify({"message": "Community created successfully"}), 200


@app.route("/communities", methods=["GET"])
def communities():
    communities = Community.query.all()
    results = []
    for community in communities:
        results.append(
            {
                "name": community.name,
                "description": community.description,
                "rating": community.rating,
                "timestamp": community.timestamp,
            }
        )

    return jsonify({"communities": results}), 200


@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    # Get data from the request
    data = request.get_json()
    audio_url = data.get("audioUrl")
    audio_config = data.get("config")

    # Check if both audio URL and audio config are provided
    if not audio_url:
        return jsonify({"error": "No audio URL was provided."}), 422
    if not audio_config:
        return jsonify({"error": "No audio config was provided."}), 422

    try:
        # Google Speech-to-Text API URL
        google_api_url = "https://speech.googleapis.com/v1/speech:recognize"

        # Prepare the payload for the request
        payload = {"audio": {"content": audio_url}, "config": audio_config}

        # Make the request to Google's Speech-to-Text API
        response = requests.post(
            google_api_url,
            json=payload,
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-goog-api-key": f"{os.getenv('GOOGLE_API_KEY')}",
            },
        )

        # Parse the response from Google API
        speech_results = response.json()

        return jsonify(speech_results), response.status_code

    except Exception as err:
        print(f"Error converting speech to text: {err}")
        return jsonify({"error": "Failed to process speech to text."}), 500


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5050, debug=True)
