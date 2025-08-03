import cv2
import numpy as np
from sklearn.cluster import KMeans

# Helper: Convert BGR colour to HEX format (e.g., (255, 0, 0) -> '#FF0000')
def bgr_to_hex(bgr):
    b, g, r = int(bgr[0]), int(bgr[1]), int(bgr[2])
    return '#{:02x}{:02x}{:02x}'.format(r,g,b)

# Extract the top 'k' dominant colours from an image and return them as HEX codes
def extract_palette(image_path, k=5):
    # Load the image from disk using OpenCV (in BGR format by default)
    image = cv2.imread(image_path)

    # Make sure the image was loaded successfully
    if image is None:
        raise ValueError("Could not load image.")

    # Convert the image to RGB colour space for accurate colour analysis
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Flatten the image array to a 2D array of pixels (each pixel is [R, G, B])
    image = image.reshape((-1, 3))

    # Apply K-Means clusttering to find the top 'k' dominant colours
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(image)

    # Convert the cluster centers (RGB colours) to HEX format
    dominant_colours = kmeans.cluster_centers_
    hex_colours = [bgr_to_hex(colour) for colour in dominant_colours]

    return hex_colours