# backend/app/utils/image_utils.py

import cv2
import numpy as np

# Crop then center of an image to a given width and height
def crop_center(image: np.ndarray, crop_width: int, crop_height: int) -> np.ndarray:

    # Get original image dimensions (height and width)
    h, w = image.shape[:2]

    # Calculate top-left starting coordinates for cropping
    start_x = max( w // 2 - crop_width // 2, 0)
    start_y = max(h // 2 - crop_height // 2, 0)

    # Slice the image array to return only the center cropped region
    return image[start_y:start_y + crop_height, start_x:start_x + crop_width]