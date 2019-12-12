from PIL import Image
import numpy as np

im = Image.open('basic_stripes.png')
im = im.convert('RGBA')

data = np.array(im)   # "data" is a height x width x 4 numpy array
red, green, blue, alpha = data.T # Temporarily unpack the bands for readability

# Replace white with red... (leaves alpha values alone...)
white_areas = (red == 255) & (blue == 255) & (green == 255)
black_areas = (red == 0) & (blue == 0) & (green == 0)
data[..., :-1][white_areas.T] = (251, 221, 80)
data[..., :-1][white_areas.T] = (230, 89, 94)

im2 = Image.fromarray(data)
im2.show()