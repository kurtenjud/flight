class GameElement {
    constructor(element, speed) {
        this.element = element;
        this.speed = speed;
        this.x = Math.random() * window.innerWidth;
    }

    move() {
        this.x -= this.speed;
        this.element.style.transform = `translateX(${this.x}px)`;
        
        // Reset position when element moves completely off screen
        if (this.x < -this.element.offsetWidth) {
            this.x = window.innerWidth;
        }
    }
}

class Game {
    constructor() {
        this.plane = document.querySelector('.plane');
        this.mountainLayers = document.querySelectorAll('.mountain-layer');
        this.cloudsContainer = document.querySelector('.clouds-container');
        
        this.setupMountains();
        this.setupClouds();
        this.setupEventListeners();
        this.animate();
        this.planeY = window.innerHeight / 2;
        this.targetY = this.planeY;
        this.planeVelocity = 0;
        this.maxVelocity = 3;
    }

    setupMountains() {
        // ... existing setupMountains code ...
    }

    setupClouds() {
        // ... existing setupClouds code ...
    }

    setupEventListeners() {
        // Handle mouse clicks
        document.addEventListener('click', (e) => {
            this.handleInteraction(e.clientY);
        });

        // Handle touch events
        document.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            // Use the first touch point's Y coordinate
            const touch = e.touches[0];
            this.handleInteraction(touch.clientY);
        });
    }

    handleInteraction(yPosition) {
        this.targetY = yPosition;
        
        // Add immediate velocity in the direction of interaction
        const deltaY = yPosition - this.planeY;
        const direction = Math.sign(deltaY);
        this.planeVelocity = direction * this.maxVelocity;
        
        // Reduced rotation multiplier for gentler tilting
        const rotation = this.planeVelocity * 0.8;
        this.plane.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    }

    animate() {
        // Move mountains and clouds
        this.mountains.forEach(mountain => mountain.move());
        this.clouds.forEach(cloud => cloud.move());

        // Enhanced plane movement with velocity and damping
        const ease = 0.006;    // Reduced from 0.008 for even more gradual movement
        const friction = 0.92;  // Reduced from 0.95 for even less bouncing

        // Update position using velocity
        this.planeY += this.planeVelocity;
        
        // Apply easing towards target
        const deltaY = this.targetY - this.planeY;
        this.planeVelocity += deltaY * ease;
        
        // Apply friction to slow down movement
        this.planeVelocity *= friction;

        // Update plane position
        this.plane.style.top = `${this.planeY}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
