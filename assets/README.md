# Assets Directory

This directory contains local copies of external assets for fallback/offline support.

## Audio Files

### ui-click.mp3
- **Purpose**: Sound effect for card hover/click interactions
- **Primary Source**: https://cdn.pixabay.com/download/audio/2022/03/15/audio_7cd80f7464.mp3?filename=ui-click-136138.mp3
- **Usage**: Fallback when CDN is unavailable
- **License**: Pixabay License (Free to use)

**To add the audio file:**
1. Download from the Pixabay CDN URL above
2. Save as `ui-click.mp3` in this directory
3. File should be ~5-10KB

## Image Files

### Course Icons
Place any course-related images here:
- download.jpeg (IoT icon)
- pythone.png (Python icon)
- c-programming.png
- webdev.png

## Font Files (Optional)

If you want to vendor the Outfit font locally:
1. Download from Google Fonts
2. Place .woff2 files here
3. Update `src/fonts.css` with local paths

## Best Practices

1. **Compression**: Optimize all images with tools like TinyPNG or ImageOptim
2. **Formats**: Use modern formats (WebP for images, WOFF2 for fonts)
3. **Naming**: Use lowercase, hyphenated names (e.g., `course-icon.png`)
4. **Size**: Keep assets small (< 100KB per file when possible)
5. **Licensing**: Ensure you have rights to use all assets

## CDN Strategy

**Primary**: Use CDN (faster, cached across sites)
**Fallback**: Load from `/assets/` if CDN fails
**Offline**: Service Worker can cache assets for offline use

## Deployment Checklist

- [ ] Download ui-click.mp3 from Pixabay
- [ ] Optimize all images
- [ ] Verify all asset paths in HTML/CSS
- [ ] Test with CDN blocked (DevTools)
- [ ] Confirm fallback works
- [ ] Check mobile data usage
