import open3d as o3d
import numpy as np
import cv2

def generate_point_cloud_open3d(depth_map, fx, fy, cx, cy):
    height, width = depth_map.shape

    # Prepare the intrinsic parameters
    intrinsic_matrix = o3d.camera.PinholeCameraIntrinsic(width, height, fx, fy, cx, cy)

    # Convert the depth map to Open3D format
    depth_o3d = o3d.geometry.Image(depth_map.astype(np.uint16))  # Convert to 16-bit if needed

    # Create a point cloud from the depth image
    pcd = o3d.geometry.PointCloud.create_from_depth_image(depth_o3d, intrinsic_matrix)

    return pcd

def main():
    # Load depth image (replace with your depth image path)
    depth_image = cv2.imread('depth_map.png', cv2.IMREAD_UNCHANGED)
    if depth_image is None:
        print("Failed to load depth image")
        return

    # Camera intrinsic parameters (assumed or retrieved from camera)
    fx = 525.0  # Focal length x-axis
    fy = 525.0  # Focal length y-axis
    cx = 319.5  # Optical center x-axis
    cy = 239.5  # Optical center y-axis

    # Generate point cloud using Open3D
    pcd = generate_point_cloud_open3d(depth_image, fx, fy, cx, cy)

    # Visualize the point cloud
    o3d.visualization.draw_geometries([pcd])

    # Optionally, save the point cloud as a .ply file
    o3d.io.write_point_cloud("output_point_cloud.ply", pcd)

if __name__ == '__main__':
    main()
