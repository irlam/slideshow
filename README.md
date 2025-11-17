# Family Photo Slideshow

A beautiful, interactive rotating image slider for displaying family photos with commenting functionality.

## Features

- **3D Rotating Carousel**: Photos rotate automatically in a stunning 3D carousel
- **Fullscreen View**: Click on any photo to view it fullscreen with zoom effect
- **Comments System**: Add comments to any photo, stored locally in your browser
- **Pause/Play Control**: Control the auto-rotation with a simple button
- **Keyboard Navigation**: Use arrow keys and Escape in fullscreen mode
- **Responsive Design**: Works beautifully on all screen sizes
- **Local Storage**: All comments are saved locally - no database required

## How to Use

1. **Open the slideshow**: Simply open `index.html` in your web browser
2. **Navigate photos**: 
   - Use the `<` and `>` buttons to manually rotate through photos
   - Or let them auto-rotate every 3 seconds
   - Use the Pause/Play button to control auto-rotation
3. **View fullscreen**: Click on any photo to see it in fullscreen mode
4. **Add comments**:
   - In fullscreen mode, enter your name and comment
   - Click "Add Comment" or press Ctrl+Enter
   - Comments are saved locally in your browser
5. **Navigate in fullscreen**: Use the arrow buttons or keyboard arrows to browse photos

## Adding Your Own Photos

To add your own family photos:

1. **Add image files**: Place your photos in the `images/` folder
2. **Update index.html**: Edit the `<span>` elements in the `image-container` div:
   ```html
   <span style="--i: 1;" data-image-id="0">
       <img src="images/your-photo.jpg" alt="Description of photo">
   </span>
   ```
3. **Add more photos**: 
   - Copy a `<span>` block
   - Update the `--i` value (increment by 1)
   - Update the `data-image-id` (increment by 1)
   - Update the image `src` and `alt` text
4. **Update totalImages**: In `script.js`, update the `totalImages` variable to match your photo count

## Technical Details

- **No dependencies**: Pure HTML, CSS, and JavaScript
- **Local storage**: Comments are stored in browser's localStorage
- **No backend required**: Everything runs client-side
- **Modern CSS**: Uses CSS Grid, Flexbox, and 3D transforms
- **Responsive**: Mobile-friendly design

## Browser Compatibility

Works in all modern browsers that support:
- CSS 3D Transforms
- LocalStorage API
- ES6 JavaScript

## Customization

Feel free to customize:
- Colors: Edit the gradient in `style.css` (body background)
- Rotation speed: Change the timeout value in `script.js` (currently 3000ms)
- Number of photos: Add or remove photo spans in `index.html`
- Layout: Adjust spacing and sizes in `style.css`

Enjoy your family photo memories! 📸