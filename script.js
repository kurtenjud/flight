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
        this.mountains = [];
        const mountainImages = [
            'mountain-1.svg',
            'mountain-2.svg',
            'mountain-3.svg',
            'mountain-4.svg'
        ];

        this.mountainLayers.forEach((layer, index) => {
            // Create just 2 mountains per layer for seamless scrolling
            for (let i = 0; i < 2; i++) {
                const img = document.createElement('img');
                img.src = `images/${mountainImages[index]}`;
                img.style.width = '100%'; // Make each mountain span full width
                layer.appendChild(img);
            }
            
            // Slower mountain movement
            this.mountains.push(new GameElement(layer, 0.2 + (index * 0.2)));
        });
    }

    setupClouds() {
        this.clouds = [];
        const cloudCount = 3; // Reduced number of clouds
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('img');
            cloud.src = 'images/cloud.svg';
            cloud.className = 'cloud';
            // Spread clouds vertically between 10% and 40% of screen height
            cloud.style.top = `${10 + (Math.random() * 30)}%`;
            // Spread clouds horizontally across the screen
            cloud.style.left = `${(i * 33) + Math.random() * 20}%`;
            this.cloudsContainer.appendChild(cloud);
            
            // Slower cloud movement
            this.clouds.push(new GameElement(cloud, 0.3 + Math.random() * 0.2));
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            this.targetY = e.clientY;
            
            // Add immediate velocity in the direction of click
            const deltaY = e.clientY - this.planeY;
            const direction = Math.sign(deltaY);
            this.planeVelocity = direction * this.maxVelocity;
            
            // Reduced rotation multiplier for gentler tilting
            const rotation = this.planeVelocity * 0.8;
            this.plane.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        });
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