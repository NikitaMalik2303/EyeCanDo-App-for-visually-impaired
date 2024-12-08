import cv2
import numpy as np
import torch
from torchvision import transforms


def load_model():
    model_type = "MiDaS_v2"  # "DPT_Hybrid" or "MiDaS_small"
    model = torch.hub.load("intel-isl/MiDaS", model_type, pretrained=True)
    model.eval()
    return model

def preprocess(image):
    transform = transforms.Compose(n[
        transforms.ToPILImage(),
        transforms.Resize((384, 384)),  
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5], std=[0.5]),
    ])
    return transform(image)

def estimate_depth(model, image):
    with torch.no_grad():
        input_tensor = preprocess(image).unsqueeze(0) 
        depth = model(input_tensor)[0]
        depth = depth.squeeze().numpy()  
        return depth
    
def calculate_depth(depth_map):
    min_dis = np.min(depth_map[depth_map>0])
    return min_dis



def convert_depth_to_distance(depth_map):
    distance_map = depth_map / 1000.0  
    return distance_map

def main():
    model = load_model()
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        depth_map = estimate_depth(model, frame)
        # depth_map = depth_map/100
        distance_map = convert_depth_to_distance(depth_map)
        min_distance = calculate_depth(depth_map)
        distance_map_normalized = cv2.normalize(distance_map, None, 0, 255, cv2.NORM_MINMAX)
        distance_map_normalized = np.uint8(distance_map_normalized) 
        distance_map_resized = cv2.resize(distance_map_normalized, (frame.shape[1], frame.shape[0])) 
        combined = np.hstack((frame, cv2.applyColorMap(distance_map_resized, cv2.COLORMAP_JET))) 
        warning_text = ""
        # if np.any(distance_map < 0.5): 
        # warning_text = "Warning: Nearby Object Detected!"
        cv2.putText(combined, f'Closest Distance: {min_distance:.2f} m', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
 
        cv2.imshow("Distance Estimation", combined)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
