# Noor-e-Flames Media & Assets Directory

Drop your website images and videos into these designated folders:

```
public/
├── images/
│   ├── hero/            # Hero section banner images (desktop & mobile)
│   ├── products/        # Perfumes, Attars, Candles & Discovery Set product shots
│   ├── banners/         # Promotional & discovery set banner graphics
│   ├── reviews/         # Customer review photos & avatars
│   └── social/          # Instagram feed & lifestyle gallery photos
│
└── videos/
    ├── reels/           # Vertical (9:16) MP4 video reels for the "Trending Reels" section
    ├── hero/            # Hero background video (optional)
    └── testimonials/    # Video reviews from customers
```

### Next.js Asset Usage:
Any file placed inside `public/` is accessible at root URL:
- `public/images/products/oud.jpg` ➔ `/images/products/oud.jpg`
- `public/videos/reels/reel1.mp4` ➔ `/videos/reels/reel1.mp4`
