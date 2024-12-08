# Import necessary packages
from imutils import face_utils
import numpy as np
import argparse
import imutils
import dlib
import cv2
import os

# Initialize argument parser
ap = argparse.ArgumentParser()
ap.add_argument("-v", "--video", help="path to the (optional) video file")
args = vars(ap.parse_args())

number = 0
frame_count = 0
detector = dlib.get_frontal_face_detector()

# Prompt for the person's name
print("Enter the person name:")
name = input()
folder_name = "dataset/" + name

# Create the folder if it does not exist
if os.path.exists(folder_name):
    print("Folder exists")
else:
    os.makedirs(folder_name)

# Initialize the video capture and try multiple methods
camera = None
for i in range(3):  # Try multiple indices to access the camera
    camera = cv2.VideoCapture(i)
    if camera.isOpened():
        print(f"Camera opened successfully with index {i}")
        break
else:
    print("Error: Could not open any camera.")
    exit()

while True:
    if frame_count % 5 == 0:
        print("Keyframe")
        grabbed, image = camera.read()

        # Check if the frame was successfully grabbed
        if not grabbed:
            print("Error: Could not read frame.")
            break

        # Check if the image is valid
        if image is not None and image.size != 0:
            image = imutils.resize(image, width=500)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Validate if the conversion to grayscale was successful
            if gray is None or len(gray.shape) != 2:
                print("Error: Conversion to grayscale failed.")
                break

            # Detect faces
            rects = detector(gray, 1)

            for (i, rect) in enumerate(rects):
                (x, y, w, h) = face_utils.rect_to_bb(rect)
                cro = image[y: y + h, x: x + w]
                out_image = cv2.resize(cro, (108, 108))
                fram = os.path.join(folder_name + "/", str(number) + "." + "jpg")
                number += 1
                cv2.imwrite(fram, out_image)
                cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

        frame_count += 1
    else:
        frame_count += 1
        print("Redundant frame")

    if number > 10:
        break

    cv2.imshow("Output Image", image)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

camera.release()
cv2.destroyAllWindows()
