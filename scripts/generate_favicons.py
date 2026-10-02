import os
import base64
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

os.makedirs('public', exist_ok=True)
os.makedirs('app', exist_ok=True)

# Load base emblem
emb_gold = Image.open('public/images/logo/logo-emblem-gold.png')
emb_light = Image.open('public/images/logo/logo-emblem-light.png')

# Helper function to generate luxury icon tile
def make_icon(size, radius_ratio=0.22, padding_ratio=0.22, dilate=0, border_w=1, brighten=0):
    tile = Image.new('RGBA', (size, size), (18, 18, 18, 255))
    draw = ImageDraw.Draw(tile)
    
    # Rounded border
    r = int(size * radius_ratio)
    inset = max(1, int(size * 0.03))
    border_alpha = 180 if size <= 48 else 100
    draw.rounded_rectangle(
        [inset, inset, size - inset - 1, size - inset - 1],
        radius=r,
        outline=(197, 168, 128, border_alpha),
        width=max(1, border_w)
    )
    
    # Emblem preparation
    emb = emb_gold.copy()
    if dilate > 0 or brighten > 0:
        a = emb.split()[3]
        if dilate > 0:
            a = a.filter(ImageFilter.MaxFilter(dilate))
        gold_color = (min(255, 197 + brighten), min(255, 168 + brighten), min(255, 128 + brighten), 0)
        emb = Image.new('RGBA', emb.size, gold_color)
        emb.putalpha(a)
        
    avail_w = int(size * (1 - padding_ratio * 2))
    ratio = avail_w / emb.width
    avail_h = int(emb.height * ratio)
    
    emb_resized = emb.resize((avail_w, avail_h), Image.Resampling.LANCZOS)
    x = (size - avail_w) // 2
    y = (size - avail_h) // 2
    tile.alpha_composite(emb_resized, (x, y))
    return tile

# 1. 512x512
icon512 = make_icon(512, radius_ratio=0.22, padding_ratio=0.18, dilate=0, border_w=6, brighten=0)
icon512.save('public/icon-512.png', optimize=True)

# 2. 192x192
icon192 = make_icon(192, radius_ratio=0.22, padding_ratio=0.18, dilate=3, border_w=3, brighten=10)
icon192.save('public/icon-192.png', optimize=True)

# 3. 180x180 Apple Touch Icon
apple180 = make_icon(180, radius_ratio=0.22, padding_ratio=0.18, dilate=3, border_w=3, brighten=10)
apple180.save('public/apple-touch-icon.png', optimize=True)
apple180.save('app/apple-icon.png', optimize=True)

# 4. 48x48
icon48 = make_icon(48, radius_ratio=0.20, padding_ratio=0.16, dilate=5, border_w=1, brighten=20)
icon48.save('public/favicon-48x48.png', optimize=True)
icon48.save('app/icon.png', optimize=True)

# 5. 32x32
icon32 = make_icon(32, radius_ratio=0.20, padding_ratio=0.15, dilate=7, border_w=1, brighten=25)
icon32.save('public/favicon-32x32.png', optimize=True)

# 6. 16x16
icon16 = make_icon(16, radius_ratio=0.20, padding_ratio=0.14, dilate=9, border_w=1, brighten=30)
icon16.save('public/favicon-16x16.png', optimize=True)

# 7. Multi-resolution favicon.ico containing 16, 32, 48
# Note: Pillow save format='ICO' accepts append_images
icon16.save(
    'public/favicon.ico',
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[icon32, icon48]
)
icon16.save(
    'app/favicon.ico',
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[icon32, icon48]
)

# 8. SVG Favicon (public/favicon.svg)
with open('public/icon-512.png', 'rb') as f:
    b64_png = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E3D0B9"/>
      <stop offset="50%" stop-color="#C5A880"/>
      <stop offset="100%" stop-color="#A3865F"/>
    </linearGradient>
    <linearGradient id="darkBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#181716"/>
      <stop offset="100%" stop-color="#0F0E0D"/>
    </linearGradient>
  </defs>
  <!-- Luxury Squircle Background -->
  <rect x="8" y="8" width="496" height="496" rx="110" fill="url(#darkBg)" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.7"/>
  <!-- Centered Insignia -->
  <image href="data:image/png;base64,{b64_png}" x="0" y="0" width="512" height="512" />
</svg>
'''
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('All favicon assets generated successfully!')
