let hasClicked = false;
let spawningActive = false;
let activationTimer;
const activationDuration = 5000; // 5 seconds

// Function to activate spawning for a limited time
function activateSpawning() {
    spawningActive = true;
    activationTimer = setTimeout(() => {
        spawningActive = false;
        console.log("Ghoul spawning deactivated.");
        // Optionally, you could remove the event listeners here if you don't want any more spawning
        // document.removeEventListener('click', clickHandler);
        // document.removeEventListener('wheel', wheelHandler);
        // document.removeEventListener('touchstart', touchHandler, { passive: false });
    }, activationDuration);
    console.log("Ghoul spawning activated for 5 seconds.");
}

// Event listener for click
const clickHandler = (event) => {
    if (spawningActive) {
        handleSpawnGhoul(event.clientX, event.clientY, !hasClicked || (event.button === 0 && Math.random() < 0.25));
        hasClicked = true;
    }
};

// Event listener for wheel
const wheelHandler = (event) => {
    if (spawningActive && Math.random() < 0.25) {
        handleSpawnGhoul(event.clientX, event.clientY, true);
    }
};

// Event listener for touchstart
const touchHandler = (event) => {
    if (spawningActive) {
        const touch = event.touches[0];
        handleSpawnGhoul(touch.clientX, touch.clientY, !hasClicked || Math.random() < 0.25);
        hasClicked = true;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    activateSpawning();
    document.addEventListener('click', clickHandler);
    document.addEventListener('wheel', wheelHandler);
    document.addEventListener('touchstart', touchHandler, { passive: false });
});

function handleSpawnGhoul(x, y, shouldSpawn) {
    if (shouldSpawn) {
        spawnGhoul(x, y);
    }
}

function spawnGhoul(spawnX, spawnY) {
    const ghoulContainer = document.getElementById('ghoul-container');
    const ghoul = document.createElement('canvas');
    const ghoulImageSrc = `assets/spriteghost.png`;
    const ghoulImage = new Image();

    const spriteFrameWidth = 64;
    const spriteFrameHeight = 64;
    const numberOfFrames = 4;
    let currentFrame = 0;

    ghoulImage.onload = () => {
        const scaleFactor = 10;
        const scaledWidth = spriteFrameWidth * scaleFactor;
        const scaledHeight = spriteFrameHeight * scaleFactor;
        ghoul.width = scaledWidth;
        ghoul.height = scaledHeight;

        ghoul.style.position = 'absolute';
        ghoul.style.left = `${spawnX - scaledWidth / 2}px`;
        ghoul.style.top = `${spawnY - scaledHeight / 2}px`;

        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        ghoulContainer.appendChild(ghoul);

        const animationDuration = Math.random() * 8000 + 5000;
        const startTime = performance.now();

        function animateGhoul(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = elapsedTime / animationDuration;

            const newX = spawnX - scaledWidth / 2 + velocityX * elapsedTime;
            const newY = spawnY - scaledHeight / 2 + velocityY * elapsedTime;

            ghoul.style.left = `${newX}px`;
            ghoul.style.top = `${newY}px`;

            const context = ghoul.getContext('2d');
            context.clearRect(0, 0, ghoul.width, ghoul.height);
            const sourceX = currentFrame * spriteFrameWidth;
            context.drawImage(
                ghoulImage,
                sourceX, 0,
                spriteFrameWidth, spriteFrameHeight,
                0, 0,
                ghoul.width, ghoul.height
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
