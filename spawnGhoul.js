let hasClicked = false;

document.addEventListener('click', (event) => {
    if (!hasClicked) {
        spawnGhoul(event.clientX, event.clientY);
        hasClicked = true;
    } else if (event.button === 0 && Math.random() < 0.25) { // 25% chance on left-click after first
        spawnGhoul(event.clientX, event.clientY);
    }
});

document.addEventListener('wheel', (event) => {
    if (Math.random() < 0.25) { // 25% chance on any scroll event
        spawnGhoul(event.clientX, event.clientY);
    }
});

function spawnGhoul(clickX, clickY) {
    const ghoulContainer = document.getElementById('ghoul-container');
    const ghoul = document.createElement('canvas'); // Use a canvas for the sprite
    const ghoulImageSrc = `assets/spriteghost.png`;
    const ghoulImage = new Image();

    // Sprite sheet configuration (ADJUST THESE TO MATCH YOUR SPRITE SHEET)
    const spriteFrameWidth = 64; // Width of each ghost frame
    const spriteFrameHeight = 64; // Height of each ghost frame
    const numberOfFrames = 4; // Number of animation frames
    let currentFrame = 0;

    ghoulImage.onload = () => {
        // Make the ghost around 10 times larger
        const scaleFactor = 10;
        const scaledWidth = spriteFrameWidth * scaleFactor;
        const scaledHeight = spriteFrameHeight * scaleFactor;
        ghoul.width = scaledWidth;
        ghoul.height = scaledHeight;

        ghoul.style.position = 'absolute';
        ghoul.style.left = `${clickX - scaledWidth / 2}px`; // Center the ghost on the event
        ghoul.style.top = `${clickY - scaledHeight / 2}px`; // Center the ghost on the event

        // Very slow drifting motion
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5; // Very slow speed
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        ghoulContainer.appendChild(ghoul);

        const animationDuration = Math.random() * 8000 + 5000; // Drift for 5 to 13 seconds
        const startTime = performance.now();

        function animateGhoul(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = elapsedTime / animationDuration;

            const newX = clickX - scaledWidth / 2 + velocityX * elapsedTime;
            const newY = clickY - scaledHeight / 2 + velocityY * elapsedTime;

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
