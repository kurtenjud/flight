class GameElement {
    constructor(element, speed) {
        this.element = element;
        this.speed = speed;
        this.x = Math.random() * window.innerWidth;
    }

    move() {
        this.x -= this.speed;
        this.element.style.transform = `translateX(${this.x}px)`;
        
        // Reset position when element moves off screen
        if (this.x < -200) {
            this.x = window.innerWidth + 100;
            
            // For clouds only: randomize vertical position when resetting
            if (this.element.classList.contains('cloud')) {
                this.element.style.top = `${Math.random() * 50}%`;
            }
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
            // Create enough mountains to fill the screen width plus extra
            const count = Math.ceil(window.innerWidth / 300) + 2;
            for (let i = 0; i < count; i++) {
                const img = document.createElement('img');
                img.src = `images/${mountainImages[index]}`;
                layer.appendChild(img);
            }
            
            // Create movement handler for each layer
            this.mountains.push(new GameElement(layer, 0.5 + (index * 0.5)));
        });
    }

    setupClouds() {
        this.clouds = [];
        const cloudCount = 5;
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('img');
            cloud.src = 'images/cloud.svg';
            cloud.className = 'cloud';
            cloud.style.top = `${Math.random() * 50}%`;
            cloud.style.left = `${Math.random() * 100}%`;
            this.cloudsContainer.appendChild(cloud);
            
            this.clouds.push(new GameElement(cloud, 0.5 + Math.random() * 0.5));
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Set target Y position based on click
            this.targetY = e.clientY;
            
            // Calculate rotation based on click position relative to current plane position
            const deltaY = e.clientY - this.planeY;
            const rotation = deltaY * 0.1;
            
            this.plane.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        });
    }

    animate() {
        // Move mountains and clouds
        this.mountains.forEach(mountain => mountain.move());
        this.clouds.forEach(cloud => cloud.move());

        // Smooth plane movement
        const ease = 0.05;
        this.planeY += (this.targetY - this.planeY) * ease;
        this.plane.style.top = `${this.planeY}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 