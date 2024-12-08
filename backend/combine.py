import cv2
import numpy as np
import face_recognition
import pickle
import threading
import time
import numpy

# Load the trained KNN model for face recognition
with open("trained_knn_model.clf", 'rb') as f:
    knn_clf = pickle.load(f)

# Load object detection model (YOLOv3)
def load_yolo_model():
    weights_path = "/Users/nikitamalik/Desktop/Psyduck/backend/yolov3.weights"
    config_path = "/Users/nikitamalik/Desktop/Psyduck/backend/yolov3.cfg"

    net = cv2.dnn.readNet(weights_path, config_path)
    layer_names = net.getLayerNames()
    output_layer_indices = net.getUnconnectedOutLayers()
    output_layers = [layer_names[i - 1] for i in output_layer_indices.flatten()]
    
    return net, output_layers

def load_labels():
    with open("coco.names", "r") as f:
        labels = f.read().strip().split("\n")
    return labels

# Global variables to hold the results
face_recognition_results = None
object_detection_results = []  # Initialize as an empty list

# Face recognition thread
def face_recognition_thread(video_capture):
    global face_recognition_results

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break

        rgb_frame = numpy.ascontiguousarray(frame[:, :, ::-1])
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        for face_encoding in face_encodings:
            closest_distances, _ = knn_clf.kneighbors([face_encoding], n_neighbors=1)
            prediction = knn_clf.predict([face_encoding])[0]
            face_recognition_results = prediction
            print("Recognized person:", prediction)

        time.sleep(1)  # Delay for 1 second

# Object detection thread
def object_detection_thread(video_capture):
    global object_detection_results

    net, output_layers = load_yolo_model()
    labels = load_labels()

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break

        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outs = net.forward(output_layers)

        class_ids = []
        confidences = []
        boxes = []
        height, width = frame.shape[:2]

        for out in outs:
            for detection in out:
                scores = detection[5:]  # get scores for each class
                class_id = np.argmax(scores)  # get class ID with highest score
                confidence = scores[class_id]  # get confidence of prediction
                if confidence > 0.5:  # threshold
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)

                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)  # Non-Maxima Suppression

        # Clear previous results
        object_detection_results.clear()

        for i in range(len(boxes)):
            if i in indexes:
                label = str(labels[class_ids[i]])
                object_detection_results.append(label)  # Add label to results
                print("Detected object:", label)

        time.sleep(1)
        
def main():
    video_capture = cv2.VideoCapture(0)  # Change to video file path if needed

    face_thread = threading.Thread(target=face_recognition_thread, args=(video_capture,))
    object_thread = threading.Thread(target=object_detection_thread, args=(video_capture,))

    face_thread.start()
    object_thread.start()

    # Main loop to keep the video feed running
    while True:
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
