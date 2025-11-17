document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const imageContainerEl = document.querySelector('.image-container');
    const prevEl = document.getElementById('prev');
    const nextEl = document.getElementById('next');
    const pausePlayEl = document.getElementById('pausePlay');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageTitle');
    const closeModal = document.querySelector('.close');
    const commentsList = document.getElementById('commentsList');
    const commentName = document.getElementById('commentName');
    const commentText = document.getElementById('commentText');
    const addCommentBtn = document.getElementById('addComment');
    const modalPrevBtn = document.getElementById('modalPrev');
    const modalNextBtn = document.getElementById('modalNext');
    
    // State
    let currentRotation = 0;
    let timer;
    let isPaused = false;
    let currentImageId = null;
    const totalImages = 10;
    
    // Images data
    const images = Array.from(document.querySelectorAll('.image-container span')).map((span, index) => ({
        id: index,
        src: span.querySelector('img').src,
        alt: span.querySelector('img').alt || `Family Photo ${index + 1}`,
        element: span
    }));
    
    // Initialize
    loadCommentsFromStorage();
    
    // Carousel Navigation
    prevEl.addEventListener('click', () => {
        currentRotation += 36;
        clearTimeout(timer);
        updateGallery();
    });

    nextEl.addEventListener('click', () => {
        currentRotation -= 36;
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
            timer = setTimeout(() => {
                currentRotation += 36;
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
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Start the gallery
    updateGallery();
});
