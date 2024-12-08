import cv2
import numpy as np
import pickle
import face_recognition

# Load KNN model for face recognition
with open("trained_knn_model.clf", 'rb') as f:
    knn_clf = pickle.load(f)

# Load YOLO model for object detection
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

def process_frame(frame):
    height, width = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    return blob, height, width

def get_predictions(net, output_layers, blob):
    net.setInput(blob)
    outs = net.forward(output_layers)
    return outs

def draw_predictions(frame, outs, height, width, labels):
    class_ids = []
    confidences = []
    boxes = []
    
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
    return boxes, confidences, class_ids, indexes

def main():
    net, output_layers = load_yolo_model()
    labels = load_labels()
    
    video_capture = cv2.VideoCapture(0)

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break
        
        rgb_frame = np.ascontiguousarray(frame[:, :, ::-1])
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        # Object detection
        blob, height, width = process_frame(frame)
        outs = get_predictions(net, output_layers, blob)
        
        boxes, confidences, class_ids, indexes = draw_predictions(frame, outs, height, width, labels)

        for i in range(len(boxes)):
            if i in indexes:
                x, y, w, h = boxes[i]
                label_id = class_ids[i]
                label_text = str(labels[label_id])

                if label_text == "person":  # Check if detected object is a person
                    if len(face_encodings) > 0:  # If there are any recognized faces
                        closest_distances, _ = knn_clf.kneighbors([face_encodings[0]], n_neighbors=1)
                        prediction = knn_clf.predict([face_encodings[0]])[0]
                        label_text = prediction  # Use the name from face recognition
                
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(frame, label_text, (x, y + 30), cv2.FONT_HERSHEY_PLAIN, 3, (255, 0, 0), 3)

        cv2.imshow('Video', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()