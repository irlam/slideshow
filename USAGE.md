# Family Photo Slideshow - Usage Guide

## Quick Start

1. **Open the slideshow**: Double-click `index.html` or open it in your web browser
2. **View photos**: Watch as photos automatically rotate in 3D every 3 seconds
3. **Interact**: Click any photo to view it fullscreen

## Controls

### Main Carousel
- **< button**: Rotate to previous photo
- **> button**: Rotate to next photo
- **⏸ Pause / ▶ Play**: Toggle auto-rotation on/off

### Fullscreen View
- **Click on photo**: Open fullscreen modal
- **X (top right)**: Close fullscreen view
- **❮ / ❯ buttons**: Navigate to previous/next photo
- **Arrow keys**: Navigate between photos (← / →)
- **Escape key**: Close fullscreen view
- **Click outside**: Close fullscreen view

## Adding Comments

1. Click on any photo to open fullscreen view
2. Scroll down to the Comments section
3. Enter your name in the "Your name" field
4. Type your comment in the text area
5. Click "Add Comment" or press Ctrl+Enter
6. Your comment will appear immediately and be saved locally

### Comment Features
- Comments are saved per photo
- Timestamps show when comments were added
- Comments persist even after closing the browser
- No limit on number of comments per photo

## Adding Your Own Photos

### Method 1: Replace Placeholder Images
1. Navigate to the `images/` folder
2. Add your photos (JPG, PNG, SVG, etc.)
3. Open `index.html` in a text editor
4. Find the `<div class="image-container">` section
5. Update each `<span>` to point to your photos:
   ```html
   <span style="--i: 1;" data-image-id="0">
       <img src="images/your-photo-1.jpg" alt="Family Vacation 2023">
   </span>
   ```

### Method 2: Add More Photos
1. Copy an existing `<span>` block
2. Increment the `--i` value (e.g., `--i: 11;`)
3. Increment the `data-image-id` value (e.g., `data-image-id="10"`)
4. Update the `src` and `alt` attributes
5. Open `script.js` and update `const totalImages = 10;` to match your total

### Example - Adding an 11th Photo
```html
<span style="--i: 11;" data-image-id="10">
    <img src="images/birthday-party.jpg" alt="Birthday Party 2023">
</span>
```

Then in `script.js`:
```javascript
const totalImages = 11; // Changed from 10 to 11
```

## Customization

### Change Rotation Speed
In `script.js`, find:
```javascript
timer = setTimeout(() => {
    currentRotation += 36;
    updateGallery();
}, 3000); // 3000 = 3 seconds
```
Change `3000` to your desired milliseconds (e.g., `5000` for 5 seconds)

### Change Background Gradient
In `style.css`, find:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```
Update the color codes to your preference

### Change Carousel Size
In `style.css`, adjust:
```css
.image-container {
    width: 200px;
    height: 200px;
}
```

### Adjust Photo Count in Circle
The current setup shows 10 photos in a circle (360° / 10 = 36° each).
- For 8 photos: Change rotation to 45° (360° / 8)
- For 12 photos: Change rotation to 30° (360° / 12)

Update in `script.js`:
```javascript
// For 8 photos (45° each)
currentRotation += 45; // Change all instances of 36 to 45
```

And in HTML, update all `--i` values and the rotation angle calculation.

## Data Management

### View Stored Comments
Open browser console (F12) and type:
```javascript
JSON.parse(localStorage.getItem('familyPhotoComments'))
```

### Export Comments
```javascript
console.log(JSON.stringify(
    JSON.parse(localStorage.getItem('familyPhotoComments')), 
    null, 
    2
));
```
Copy the output to save your comments

### Clear All Comments
```javascript
localStorage.removeItem('familyPhotoComments');
```
Then refresh the page

### Import Comments
```javascript
localStorage.setItem('familyPhotoComments', '[/* paste your JSON here */]');
```

## Browser Compatibility

✅ Chrome, Edge, Firefox, Safari (latest versions)
✅ Mobile browsers (iOS Safari, Chrome Mobile)
⚠️ Requires JavaScript enabled
⚠️ Requires LocalStorage support

## Tips & Tricks

1. **Optimal Image Size**: Use images around 800x600 pixels for best performance
2. **Image Format**: JPG for photos, PNG for graphics, SVG for logos
3. **Backup Comments**: Periodically export comments using the console method above
4. **Multiple Instances**: Each browser stores comments separately
5. **Private Browsing**: Comments won't persist in private/incognito mode

## Troubleshooting

### Photos not displaying
- Check image paths are correct
- Ensure images are in the `images/` folder
- Check browser console for errors (F12)

### Comments not saving
- Check if browser has localStorage enabled
- Check if in private/incognito mode
- Try a different browser

### Carousel not rotating
- Check if browser supports CSS 3D transforms
- Try disabling browser extensions
- Check JavaScript is enabled

### Modal not opening
- Check browser console for JavaScript errors
- Ensure you're clicking on the image, not around it
- Try a hard refresh (Ctrl+F5)

## Support

For issues or questions:
1. Check this guide first
2. Check browser console for errors
3. Verify all files are present (index.html, style.css, script.js)
4. Try in a different browser

Enjoy your family photo memories! 📸✨
