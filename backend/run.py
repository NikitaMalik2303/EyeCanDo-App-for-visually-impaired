import cv2
import face_recognition
import pickle
import numpy

with open("models/trained_knn_model.clf", 'rb') as f:
    knn_clf = pickle.load(f)

video_capture = cv2.VideoCapture(0)

while True:
    ret, frame = video_capture.read()
    rgb_frame = numpy.ascontiguousarray(frame[:, :, ::-1])
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    for face_encoding, (top, right, bottom, left) in zip(face_encodings, face_locations):
        closest_distances, _ = knn_clf.kneighbors([face_encoding], n_neighbors=1)
        prediction = knn_clf.predict([face_encoding])[0]
        print("Recognized person:", prediction, "Distance:", closest_distances[0][0])
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, prediction, (left + 6, bottom - 6), font, 0.5, (255, 255, 255), 1)
    cv2.imshow('Video', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()