document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const imageContainerEl = document.querySelector('.image-container');
    const prevEl = document.getElementById('prev');
    const nextEl = document.getElementById('next');
    const pausePlayEl = document.getElementById('pausePlay');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageTitle');
    const closeModal = document.getElementById('imageModalClose');
    const commentsList = document.getElementById('commentsList');
    const commentName = document.getElementById('commentName');
    const commentText = document.getElementById('commentText');
    const addCommentBtn = document.getElementById('addComment');
    const modalPrevBtn = document.getElementById('modalPrev');
    const modalNextBtn = document.getElementById('modalNext');
    
    // Upload elements
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const uploadClose = document.getElementById('uploadClose');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadTitle = document.getElementById('uploadTitle');
    const uploadComment = document.getElementById('uploadComment');
    const submitUpload = document.getElementById('submitUpload');
    const cancelUpload = document.getElementById('cancelUpload');
    
    // State
    let currentRotation = 0;
    let timer;
    let isPaused = false;
    let currentImageId = null;
    let totalImages = 10;
    let selectedFile = null;
    
    // Images data
    let images = [];
    
    // Initialize
    loadCommentsFromStorage();
    loadUploadedImages();
    initializeImages();
    
    // Carousel Navigation
    prevEl.addEventListener('click', () => {
        const rotateAmount = 360 / totalImages;
        currentRotation += rotateAmount;
        clearTimeout(timer);
        updateGallery();
    });

    nextEl.addEventListener('click', () => {
        const rotateAmount = 360 / totalImages;
        currentRotation -= rotateAmount;
        clearTimeout(timer);
        updateGallery();
    });
    
    // Pause/Play functionality
    pausePlayEl.addEventListener('click', () => {
        isPaused = !isPaused;
        pausePlayEl.textContent = isPaused ? '▶ Play' : '⏸ Pause';
        
        if (isPaused) {
            clearTimeout(timer);
        } else {
            updateGallery();
        }
    });
    
    // Image click handlers for modal
    images.forEach((image, index) => {
        image.element.querySelector('img').addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(index);
        });
    });
    
    // Modal close handler
    closeModal.addEventListener('click', () => {
        closeModalView();
    });
    
    // Click outside modal to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalView();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModalView();
            } else if (e.key === 'ArrowLeft') {
                navigateModal(-1);
            } else if (e.key === 'ArrowRight') {
                navigateModal(1);
            }
        }
    });
    
    // Modal navigation buttons
    modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(-1);
    });
    
    modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(1);
    });
    
    // Add comment handler
    addCommentBtn.addEventListener('click', () => {
        addComment();
    });
    
    // Enter key to submit comment
    commentText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            addComment();
        }
    });
    
    // Functions
    function updateGallery() {
        imageContainerEl.style.transform = `perspective(1000px) rotateY(${currentRotation}deg)`;
        
        if (!isPaused) {
            const rotateAmount = 360 / totalImages;
            timer = setTimeout(() => {
                currentRotation += rotateAmount;
                updateGallery();
            }, 3000);
        }
    }
    
    function openModal(imageIndex) {
        currentImageId = imageIndex;
        modalImg.src = images[imageIndex].src;
        modalTitle.textContent = images[imageIndex].alt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Stop carousel when modal is open
        clearTimeout(timer);
        
        // Load comments for this image
        displayComments(imageIndex);
    }
    
    function closeModalView() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentImageId = null;
        
        // Resume carousel if not paused
        if (!isPaused) {
            updateGallery();
        }
    }
    
    function navigateModal(direction) {
        currentImageId = (currentImageId + direction + totalImages) % totalImages;
        modalImg.src = images[currentImageId].src;
        modalTitle.textContent = images[currentImageId].alt;
        displayComments(currentImageId);
    }
    
    function addComment() {
        const name = commentName.value.trim();
        const text = commentText.value.trim();
        
        if (!name || !text) {
            alert('Please enter both your name and a comment.');
            return;
        }
        
        const comment = {
            id: Date.now(),
            imageId: currentImageId,
            author: name,
            text: text,
            date: new Date().toISOString()
        };
        
        // Save to localStorage
        saveComment(comment);
        
        // Clear inputs
        commentName.value = '';
        commentText.value = '';
        
        // Refresh comments display
        displayComments(currentImageId);
    }
    
    function saveComment(comment) {
        let comments = JSON.parse(localStorage.getItem('familyPhotoComments') || '[]');
        comments.push(comment);
        localStorage.setItem('familyPhotoComments', JSON.stringify(comments));
    }
    
    function loadCommentsFromStorage() {
        // Initialize if not exists
        if (!localStorage.getItem('familyPhotoComments')) {
            localStorage.setItem('familyPhotoComments', '[]');
        }
    }
    
    function getCommentsForImage(imageId) {
        const allComments = JSON.parse(localStorage.getItem('familyPhotoComments') || '[]');
        return allComments.filter(comment => comment.imageId === imageId)
                         .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    function displayComments(imageId) {
        const comments = getCommentsForImage(imageId);
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(comment.author)}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${escapeHtml(comment.text)}</div>
            </div>
        `).join('');
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }
    
    // Upload functionality
    uploadBtn.addEventListener('click', () => {
        openUploadModal();
    });
    
    uploadClose.addEventListener('click', () => {
        closeUploadModal();
    });
    
    cancelUpload.addEventListener('click', () => {
        closeUploadModal();
    });
    
    uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            closeUploadModal();
        }
    });
    
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    submitUpload.addEventListener('click', () => {
        uploadImage();
    });
    
    function openUploadModal() {
        uploadModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeUploadModal() {
        uploadModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetUploadForm();
    }
    
    function resetUploadForm() {
        fileInput.value = '';
        uploadPreview.classList.remove('show');
        uploadPreview.src = '';
        uploadTitle.value = '';
        uploadComment.value = '';
        selectedFile = null;
    }
    
    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file is too large. Please select an image smaller than 5MB');
            return;
        }
        
        selectedFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadPreview.src = e.target.result;
            uploadPreview.classList.add('show');
        };
        reader.readAsDataURL(file);
    }
    
    function uploadImage() {
        if (!selectedFile) {
            alert('Please select an image to upload');
            return;
        }
        
        // Show loading state
        submitUpload.disabled = true;
        submitUpload.textContent = 'Uploading...';
        
        // Create FormData for server upload
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('title', uploadTitle.value.trim() || `Uploaded Photo ${Date.now()}`);
        formData.append('comment', uploadComment.value.trim());
        
        // Try to upload to server first
        fetch('upload.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Server upload successful
                const imageData = {
                    id: Date.now(),
                    src: data.url,
                    alt: data.title,
                    uploaded: true,
                    uploadDate: data.uploadDate,
                    serverStored: true
                };
                
                try {
                    // Save to localStorage
                    saveUploadedImage(imageData);
                    
                    // Add initial comment if provided
                    if (data.comment) {
                        const comment = {
                            id: Date.now(),
                            imageId: images.length,
                            author: 'Uploader',
                            text: data.comment,
                            date: new Date().toISOString()
                        };
                        saveComment(comment);
                    }
                    
                    // Reload images and refresh carousel
                    loadUploadedImages();
                    initializeImages();
                    recalculateCarousel();
                    
                    // Close modal
                    closeUploadModal();
                    
                    // Show success message
                    alert('Photo uploaded successfully to server!');
                } catch (saveError) {
                    console.error('Failed to save image reference:', saveError);
                    alert('Photo uploaded to server but failed to save locally: ' + saveError.message);
                    // Still close modal since server upload succeeded
                    closeUploadModal();
                }
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        })
        .catch(error => {
            console.warn('Server upload failed, falling back to localStorage:', error);
            
            // Fallback to localStorage if server upload fails
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now(),
                    src: e.target.result,
                    alt: uploadTitle.value.trim() || `Uploaded Photo ${Date.now()}`,
                    uploaded: true,
                    uploadDate: new Date().toISOString(),
                    serverStored: false
                };
                
                try {
                    // Save to localStorage
                    saveUploadedImage(imageData);
                    
                    // Add initial comment if provided
                    if (uploadComment.value.trim()) {
                        const comment = {
                            id: Date.now(),
                            imageId: images.length,
                            author: 'Uploader',
                            text: uploadComment.value.trim(),
                            date: new Date().toISOString()
                        };
                        saveComment(comment);
                    }
                    
                    // Reload images and refresh carousel
                    loadUploadedImages();
                    initializeImages();
                    recalculateCarousel();
                    
                    // Close modal
                    closeUploadModal();
                    
                    // Show success message
                    alert('Photo uploaded successfully (saved locally)!');
                } catch (saveError) {
                    console.error('Failed to save image:', saveError);
                    alert('Error: ' + saveError.message);
                    // Don't close modal so user can try again with a smaller image
                }
            };
            reader.readAsDataURL(selectedFile);
        })
        .finally(() => {
            // Reset button state
            submitUpload.disabled = false;
            submitUpload.textContent = 'Upload Photo';
        });
    }
    
    function saveUploadedImage(imageData) {
        try {
            let uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
            uploadedImages.push(imageData);
            localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22) {
                // Storage quota exceeded - offer to clear old images
                const clearOld = confirm(
                    'Browser storage is full! Would you like to clear old uploaded images to make room?\n\n' +
                    'Click OK to clear old images and try again, or Cancel to keep existing images.'
                );
                
                if (clearOld) {
                    // Clear old uploaded images
                    localStorage.removeItem('uploadedImages');
                    
                    // Try saving again
                    try {
                        const uploadedImages = [imageData];
                        localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
                        alert('Old images cleared. Your new photo has been saved.');
                    } catch (e2) {
                        // If it still fails, the image is too large
                        throw new Error('Image is too large to store. Please try a smaller image.');
                    }
                } else {
                    throw new Error('Storage is full. Cannot save image.');
                }
            } else {
                throw e;
            }
        }
    }
    
    function loadUploadedImages() {
        const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
        
        // Add uploaded images to the carousel
        uploadedImages.forEach((imgData, index) => {
            const existingSpan = document.querySelector(`[data-uploaded-id="${imgData.id}"]`);
            if (!existingSpan) {
                const span = document.createElement('span');
                const totalSpans = imageContainerEl.querySelectorAll('span').length;
                span.style.setProperty('--i', totalSpans + 1);
                span.setAttribute('data-uploaded-id', imgData.id);
                span.setAttribute('data-image-id', totalSpans);
                
                const img = document.createElement('img');
                img.src = imgData.src;
                img.alt = imgData.alt;
                img.style.cursor = 'pointer';
                
                span.appendChild(img);
                imageContainerEl.appendChild(span);
            }
        });
    }
    
    function initializeImages() {
        images = Array.from(document.querySelectorAll('.image-container span')).map((span, index) => {
            span.setAttribute('data-image-id', index);
            return {
                id: index,
                src: span.querySelector('img').src,
                alt: span.querySelector('img').alt || `Photo ${index + 1}`,
                element: span
            };
        });
        
        totalImages = images.length;
        
        // Add click handlers to all images
        images.forEach((image, index) => {
            const img = image.element.querySelector('img');
            // Remove old listeners by cloning
            const newImg = img.cloneNode(true);
            img.parentNode.replaceChild(newImg, img);
            
            newImg.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(index);
            });
        });
    }
    
    function recalculateCarousel() {
        const anglePerImage = 360 / totalImages;
        
        // Update CSS variable for each span
        images.forEach((image, index) => {
            image.element.style.setProperty('--i', index + 1);
        });
        
        // Update rotation logic
        const oldRotateAmount = 36; // Old value for 10 images
        const newRotateAmount = anglePerImage;
        
        // Store the recalculate function for navigation
        window.carouselRotateAmount = newRotateAmount;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Start the gallery
    updateGallery();
});
