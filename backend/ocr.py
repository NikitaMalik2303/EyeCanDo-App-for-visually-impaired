import cv2
import pytesseract
from PIL import Image


def capture_image():
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open video stream.")
        return None

    ret, frame = cap.read()  
    if not ret:
        print("Error: Failed to capture image.")
        return None

    cap.release()  

    img_path = "captured_image.jpg"
    cv2.imwrite(img_path, frame)
    
    return img_path

def perform_ocr(image_path):

    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    
    return text

def main():

    img_path = capture_image()
    
    if img_path:
        print("Image captured successfully.")
        detected_text = perform_ocr(img_path)
        
        print("Detected Text from Image:")
        print(detected_text)
    else:
        print("Failed to capture image.")

if __name__ == "__main__":
    main()
