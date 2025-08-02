import cv2
import numpy as np
from sklearn.cluster import KMeans

def extract_palette(image_path, k=5):
    # Load the image from disk using OpenCV (in BGR format by default)
    image = cv2.imread(image_path)

    # Convert the image to RGB colour space for accurate color analysis
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Flatten the image array to a 2D array of pixels (each pixel is [R, G, B])
    image = image.reshape((-1, 3))

    # Apply K-Means clusttering to find the top 'k' dominant colors
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(image)

    # Get the cluster centers (the dominant colors) and convert to integers
    colors = kmeans.cluster_centers_.astype(int)

    # Returns the colors as a list of RGB tuples
    return [tuple(color) for color in colors]