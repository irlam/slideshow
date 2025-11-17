document.addEventListener('DOMContentLoaded', function () {
    const imageContainerEl = document.querySelector('.image-container');
    const prevEl = document.getElementById('prev');
    const nextEl = document.getElementById('next');
    let currentRotation = 0;
    let timer;

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

    function updateGallery() {
        imageContainerEl.style.transform = `perspective(1000px) rotateY(${currentRotation}deg)`;
        timer = setTimeout(() => {
            currentRotation += 36;
            updateGallery();
        }, 3000);
    }

    updateGallery();
});
