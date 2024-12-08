from transformers import pipeline
from PIL import Image
import numpy as np
import cv2

pipe = pipeline(task="depth-estimation", model="LiheYoung/depth-anything-small-hf")

def process_frame(frame):

    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    depth = pipe(image)["depth"]
    depth_np = np.array(depth)
    scaling_factor = 1 / 100.0  # Example scaling factor, tweak based on the specific application
    absolute_depth = depth_np * scaling_factor

    # Image dimensions
    height, width = absolute_depth.shape

    left_region = absolute_depth[:, :width // 3]
    center_region = absolute_depth[:, width // 3: 2 * width // 3]
    right_region = absolute_depth[:, 2 * width // 3:]
    top_region = absolute_depth[:height // 3, :]
    bottom_region = absolute_depth[2 * height // 3:, :]

    # Thresholding to isolate large objects (20th percentile) for each region
    threshold = np.percentile(absolute_depth, 20)

    # Apply the threshold for each region to find large objects
    large_object_mask_left = left_region < threshold
    large_object_mask_center = center_region < threshold
    large_object_mask_right = right_region < threshold
    large_object_mask_top = top_region < threshold
    large_object_mask_bottom = bottom_region < threshold

    # Find the nearest large object's depth for each region
    nearest_left_depth = left_region[large_object_mask_left].min() if np.any(large_object_mask_left) else np.inf
    nearest_center_depth = center_region[large_object_mask_center].min() if np.any(large_object_mask_center) else np.inf
    nearest_right_depth = right_region[large_object_mask_right].min() if np.any(large_object_mask_right) else np.inf
    nearest_top_depth = top_region[large_object_mask_top].min() if np.any(large_object_mask_top) else np.inf
    nearest_bottom_depth = bottom_region[large_object_mask_bottom].min() if np.any(large_object_mask_bottom) else np.inf

    # Detect elevation (stairs/slopes)
    # slope_detected = False
    # stairs_detected = False

    # Check for elevation changes in the top region
    # top_mean_depth = np.mean(top_region)
    # bottom_mean_depth = np.mean(bottom_region)

    # Example thresholds for slope detection (these values can be adjusted)
    # slope_threshold = 0.1  # Example threshold for detecting slopes

    # Check for slope
    # if top_mean_depth < (bottom_mean_depth - slope_threshold):
    #     slope_detected = True

    # Check for stairs
    # if (bottom_mean_depth - top_mean_depth) > stairs_threshold:
    #     stairs_detected = True

    # Normalize and colorize the depth map
    depth_normalized = (absolute_depth / absolute_depth.max() * 255).astype(np.uint8)
    colored_depth_map = cv2.applyColorMap(depth_normalized, cv2.COLORMAP_JET)

    # Find the region with the closest object
    region_depths = {
        "left": nearest_left_depth,
        "center": nearest_center_depth,
        "right": nearest_right_depth,
        "top": nearest_top_depth,
        "bottom": nearest_bottom_depth
    }

    # Find the closest region
    closest_region = min(region_depths, key=region_depths.get)
    closest_depth = region_depths[closest_region]

    return colored_depth_map, closest_region, closest_depth

def main():

    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        depth_map, closest_region, closest_depth = process_frame(frame)

        combined = np.hstack((frame, depth_map))

        # Add nearest object distances for each region on the frame
        cv2.putText(combined, f'Closest Obstacle: {closest_depth:.2f}m in {closest_region}',
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        # Add slope/stairs detection feedback
        # if slope_detected:
        #     cv2.putText(combined, 'Slope Detected!', (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        #     print("Slope detected.")
        # if stairs_detected:
        #     cv2.putText(combined, 'Stairs Detected!', (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        #     print("Stairs detected.")

        # Show the combined frame and depth map
        cv2.imshow('Depth Estimation - Press "q" to exit', combined)

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the video capture object and close windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
