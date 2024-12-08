import os
import sys
import numpy as np
import matplotlib.pyplot as plt
import open3d as o3d
# sys.path.append('..')
# import open3d_tutorial as o3dtut

# o3dtut.interactive = True

pcd = o3d.io.read_point_cloud("./Scaniverse 2024-10-17 201725.ply")
print(pcd)
print(np.asarray(pcd.points))

points= np.asanyarray(pcd.points)
np.save("point_cloud.npy", points)  
np.savetxt("point_cloud.csv", points, delimiter=",")

o3d.visualization.draw_geometries([pcd])


# alpha= 0.07
# mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_alpha_shape(pcd, alpha)
# mesh.compute_vertex_normals()
# o3d.visualization.draw_geometries([mesh], mesh_show_back_face=True)


# vis = o3d.visualization.VisualizerWithEditing()

# vis.create_window()
# vis.add_geometry(pcd)
# vis.run()  # user picks points, press 'Q' or 'ESC' to finish
# vis.destroy_window()

# # The picked points will be stored in vis.picked_points
# picked_points = vis.get_picked_points()

# if len(picked_points) == 2:
#     # Extract the coordinates of the two selected points
#     point1 = np.asarray(pcd.points)[picked_points[0]]
#     point2 = np.asarray(pcd.points)[picked_points[1]]

#     # Calculate the Euclidean distance between the two points
#     distance = np.linalg.norm(point1 - point2)

#     print(f"Point 1 coordinates: {point1}")
#     print(f"Point 2 coordinates: {point2}")
#     print(f"Distance between the two points: {distance}")
# else:
#     print("Please select exactly 2 points.")
