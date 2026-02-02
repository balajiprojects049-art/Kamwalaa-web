## Image Optimization Guide

Your website is slow because of large, unoptimized images. Here's how to fix it:

### Current Issues:
- `main-plumbing.png`: 995 KB ❌
- `partner-hero.png`: 789 KB ❌  
- `hero-collage-1.png`: 745 KB ❌
- Multiple images over 600 KB each

### Recommended Target Sizes:
- Hero images: < 200 KB
- Service images: < 100 KB
- Icons: < 20 KB

### Quick Fix Options:

#### Option 1: Online Tools (Fastest)
1. Go to https://tinypng.com or https://compressor.io
2. Upload your large PNG/JPG files from `public/assets/images`
3. Download compressed versions
4. Replace the originals

#### Option 2: Use WebP Format
- WebP images are 30-80% smaller than PNG/JPG
- Modern browsers support it
- Tools: https://squoosh.app

### After Optimization:
Run `npm run build` and redeploy to Vercel

Your site should load 3-5x faster! 🚀
