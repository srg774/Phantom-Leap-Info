document.addEventListener('click', (event) => {
    spawnGhoul(event.clientX, event.clientY);
});

function spawnGhoul(clickX, clickY) {
    const ghoulContainer = document.getElementById('ghoul-container');
    const ghoul = document.createElement('canvas'); // Use a canvas to draw the sprite
    const ghoulImageSrc = `assets/${getRandomGhoulImage()}`;
    const ghoulImage = new Image();

    // Sprite sheet configuration (adjust these based on your sprite sheet)
    const spriteFrameWidth = 64; // Width of each ghost frame in the sprite sheet
    const spriteFrameHeight = 64; // Height of each ghost frame
    const numberOfFrames = 4; // Number of animation frames in the sprite sheet
    let currentFrame = 0;

    ghoulImage.onload = () => {
        // Set the initial size of the canvas to the frame size
        const randomSize = Math.random() * 40 + 30; // Between 30px and 70px (adjust as needed)
        ghoul.width = spriteFrameWidth * (randomSize / spriteFrameWidth); // Scale canvas width
        ghoul.height = spriteFrameHeight * (randomSize / spriteFrameHeight); // Scale canvas height
        const scaleFactor = randomSize / spriteFrameWidth;

        ghoul.style.position = 'absolute';
        ghoul.style.left = `${clickX}px`;
        ghoul.style.top = `${clickY}px`;

        // Set a random trajectory
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        ghoulContainer.appendChild(ghoul);

        const animationDuration = Math.random() * 3000 + 2000;
        const startTime = performance.now();

        function animateGhoul(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = elapsedTime / animationDuration;

            const newX = clickX + velocityX * elapsedTime;
            const newY = clickY + velocityY * elapsedTime;

            ghoul.style.left = `${newX}px`;
            ghoul.style.top = `${newY}px`;

            // Draw the current sprite frame
            const context = ghoul.getContext('2d');
            context.clearRect(0, 0, ghoul.width, ghoul.height);
            const sourceX = currentFrame * spriteFrameWidth;
            context.drawImage(
                ghoulImage,
                sourceX, 0, // Source x, y
                spriteFrameWidth, spriteFrameHeight, // Source width, height
                0, 0, // Destination x, y
                ghoul.width, ghoul.height // Destination width, height
            );

            // Update to the next frame
            currentFrame = (currentFrame + 1) % numberOfFrames;

            if (progress < 1) {
                requestAnimationFrame(animateGhoul);
            } else {
                ghoul.remove();
            }
        }

        requestAnimationFrame(animateGhoul);
    };

    ghoulImage.src = ghoulImageSrc;
}

function getRandomGhoulImage() {
    return 'spriteghost.png';
}
