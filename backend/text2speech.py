import cv2
import numpy
import numpy as np
from gtts import gTTS
import os
import pyttsx3


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

def get_predictions(net, output_layers, blob):
    net.setInput(blob)
    outs = net.forward(output_layers)
    return outs

def draw_predictions(frame, outs, height, width, labels):
    class_ids = []
    confidences = []
    boxes = []
    detected_objects = []

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

                # Append the detected object (label and distance) to the list
                detected_objects.append((labels[class_id], center_y))

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)  # Non-Maxima Suppression

    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            label = str(labels[class_ids[i]])
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, label, (x, y + 30), cv2.FONT_HERSHEY_PLAIN, 3, (255, 0, 0), 3)

    return frame, detected_objects

def speak_text(text):
    engine = pyttsx3.init()
    rate= engine.getProperty("rate")
    engine.setProperty('rate', rate * 0.8)
    engine.say(text)
    engine.runAndWait()


def main():
    net, output_layers = load_yolo_model()
    labels = load_labels()
    cap = cv2.VideoCapture(0)

    prev_obj = None
    while True:
        grabbed, frame = cap.read()
        if not grabbed:
            break

        # frame = cv2.resize(frame, (300, 300))  
        blob, height, width = process_frame(frame)
        outs = get_predictions(net, output_layers, blob)
        result_frame, detected_objects = draw_predictions(frame, outs, height, width, labels)

        if detected_objects:
            nearest_object = min(detected_objects, key=lambda obj: obj[1])
            object_label = nearest_object[0]
            print(f"Nearest object: {object_label}")

            if prev_obj != object_label:
                speak_text(f"The nearest object is a {object_label}")
                prev_obj= object_label

        cv2.imshow("Live Video Feed", result_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):   
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()