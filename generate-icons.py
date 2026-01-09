#!/usr/bin/env python3
import struct
import zlib
import os

def create_png(width, height, filename):
    """Create a simple PNG with gradient color"""
    signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk - create image data
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # filter type
        for x in range(width):
            # Purple gradient colors
            r = int(102 + (118 * x / width))
            g = int(126 + (74 * x / width))
            b_val = int(234 - (50 * x / width))
            raw_data += bytes([r, g, b_val])
    
    compressed = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    idat = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    iend = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    # Write PNG
    with open(filename, 'wb') as f:
        f.write(signature + ihdr + idat + iend)

# Change to icons directory
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/icons')

# Create icons of different sizes
sizes = [16, 48, 128, 256]
for size in sizes:
    create_png(size, size, f'icon{size}.png')
    print(f'Created icon{size}.png')

print('All icons generated successfully!')
