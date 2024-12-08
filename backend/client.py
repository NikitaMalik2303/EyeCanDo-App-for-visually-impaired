import cv2
import requests
import time
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=2)  # Limit the number of simultaneous threads

def send_frame_to_flask_server(frame):
    # Convert the frame to JPEG format
    _, img_encoded = cv2.imencode('.jpg', frame)
    files = {'frame': ('frame.jpg', img_encoded.tobytes(), 'image/jpeg')}
    
    try:
        # Make the POST request to the Flask API
        response = requests.post('http://localhost:5050/recognize', files=files)
        if response.status_code == 200:
            data = response.json()
            if data:
                for result in data:
                    print(f"Recognized person: {result['name']} (Distance: {result['distance']:.2f})")
            else:
                print("No face detected")
        else:
            print("Error:", response.json().get('error', 'Unknown error'))
    except Exception as e:
        print("Error connecting to the Flask server:", e)

def send_frame_async(frame):
    # Submit the task to be run asynchronously
    executor.submit(send_frame_to_flask_server, frame)

def main():
    video_capture = cv2.VideoCapture(0)
    
    if not video_capture.isOpened():
        print("Error: Could not open the webcam.")
        return

    frame_interval = 30  # Only process every 30 frames (adjust as needed)
    frame_count = 0

    while True:
        ret, frame = video_capture.read()
        if not ret or frame is None:
            print("Error: Could not read frame from the webcam.")
            break
        
        # Display the video feed
        cv2.imshow("Camera Feed", frame)
        
        # Send every nth frame to the Flask server asynchronously
        if frame_count % frame_interval == 0:
            send_frame_async(frame)

        frame_count += 1

        # Press 'q' to exit the loop
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
