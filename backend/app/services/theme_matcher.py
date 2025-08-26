"""
theme_matcher.py
- Lightweight palette → theme matcher.
- Input: palette list like ['#aabbcc', '#112233']
- Output: 'Spring' / 'Summer' / 'Autumn' / 'Winter' / 'Neutral'
- Converts hex colors to RGB → HSV → Hue degrees, then assigns a seasonal theme.
"""

import colorsys

# Define seasonal hue ranges
def hex_to_rgb(hex_str):
    """Convert hex color string to RGB tuple. e.g '#aabbcc' -> (170, 187, 204)"""
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0,2,4))


# Seasonal hue ranges in degrees
""" Convert RGB (0-255) to hue in degrees (0-360). Use colorsys.rgb_to_hsv which expects 0..1 values. """
def rgb_to_hue(rgb):
    r, g, b = (v / 255.0 for v in rgb)
    h, _, _ = colorsys.rgb_to_hsv(r, g, b)
    return h * 360  # Convert to degrees

# match theme based on hue to seasonal ranges
""" 
Assign a seasonal theme based on average hue of the palette. 
- palette: list of hex strings
- returns: 'Spring' / 'Summer' / 'Autumn' / 'Winter' / 'Neutral'
"""
def match_theme(palette):
    hues = []
    for hex_color in palette:
        try:
            # Convert hex to RGB, then to hue
            rgb = hex_to_rgb(hex_color)
            # Get hue in degrees
            hue_deg = rgb_to_hue(rgb)
            # Collect valid hues
            hues.append(hue_deg)
        except Exception:
            # Skip invalid colors
            continue

    # If no valid hues, return Neutral   
    if not hues:
        return "Neutral"

    # Calculate average hue
    avg_hue = sum(hues) / len(hues)

    # Simple ranges: adjust as needed for better accuracy
    if avg_hue < 30 or avg_hue >= 330:
        return "Autumn" # warm reds/oranges
    elif avg_hue < 90:
        return "Spring" # yellows/greens
    elif avg_hue < 210:
        return "Summer" # greens/blues
    else:
        return "Winter" # cool blues/purples
