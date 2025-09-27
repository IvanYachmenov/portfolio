class PixelDisplacementEffect {
    constructor(containerId, imageUrl) {
        this.container = document.getElementById(containerId);
        this.imageUrl = imageUrl;
        this.canvas = null;
        this.overlayCanvas = null;
        this.ctx = null;
        this.overlayCtx = null;
        this.img = null;
        this.particles = [];
        this.mouse = { x: -100, y: -100 };
        this.isActive = false;
        this.gridSize = 4;

        this.init();
    }

    init() {
        if (!this.container) return;

        this.container.innerHTML = '';

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.container.appendChild(this.canvas);

        this.overlayCanvas = document.createElement('canvas');
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        this.overlayCanvas.style.position = 'absolute';
        this.overlayCanvas.style.top = '0';
        this.overlayCanvas.style.left = '0';
        this.overlayCanvas.style.width = '100%';
        this.overlayCanvas.style.height = '100%';
        this.overlayCanvas.style.pointerEvents = 'none'; //
        this.container.appendChild(this.overlayCanvas);

        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.onload = () => {
            this.setupCanvases();
            this.createParticles();
            this.renderBackground();
        };
        this.img.src = this.imageUrl;

        this.setupEventListeners();
    }

    setupCanvases() {
        const dpr = window.devicePixelRatio || 1;
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.ctx.scale(dpr, dpr);
        this.ctx.imageSmoothingEnabled = true;

        this.overlayCanvas.width = width * dpr;
        this.overlayCanvas.height = height * dpr;
        this.overlayCanvas.style.width = width + 'px';
        this.overlayCanvas.style.height = height + 'px';
        this.overlayCtx.scale(dpr, dpr);
        this.overlayCtx.imageSmoothingEnabled = false;
    }

    createParticles() {
        this.particles = [];
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.ctx.drawImage(this.img, 0, 0, width, height);

        for (let y = 0; y < height; y += this.gridSize) {
            for (let x = 0; x < width; x += this.gridSize) {
                if (x < width && y < height) {
                    const pixelData = this.ctx.getImageData(x * (this.canvas.width / width),
                        y * (this.canvas.height / height), 1, 1).data;

                    this.particles.push({
                        x: x + this.gridSize / 2,
                        y: y + this.gridSize / 2,
                        originalX: x + this.gridSize / 2,
                        originalY: y + this.gridSize / 2,
                        size: this.gridSize,
                        color: `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`,
                        transition: 0
                    });
                }
            }
        }
    }

    setupEventListeners() {
        let rafId;

        this.container.addEventListener('mouseenter', () => {
            this.isActive = true;
            this.animate();
        });

        this.container.addEventListener('mouseleave', () => {
            this.isActive = false;
            this.resetParticles();
        });

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;

            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                this.updateParticles();
            });
        });
    }

    updateParticles() {
        if (!this.isActive) return;

        this.particles.forEach(particle => {
            const dx = particle.originalX - this.mouse.x;
            const dy = particle.originalY - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                const force = Math.max(0, (80 - distance) / 80);
                const angle = Math.atan2(dy, dx);
                const displacement = force * 25;

                particle.x = particle.originalX + Math.cos(angle) * displacement;
                particle.y = particle.originalY + Math.sin(angle) * displacement;
                particle.transition = Math.min(particle.transition + 0.3, 1);
            } else {
                particle.transition = Math.max(particle.transition - 0.15, 0);
                const returnSpeed = 0.2;

                particle.x += (particle.originalX - particle.x) * returnSpeed;
                particle.y += (particle.originalY - particle.y) * returnSpeed;
            }
        });
    }

    renderBackground() {

        this.ctx.clearRect(0, 0, this.container.offsetWidth, this.container.offsetHeight);
        this.ctx.drawImage(this.img, 0, 0, this.container.offsetWidth, this.container.offsetHeight);
    }

    renderParticles() {

        this.overlayCtx.clearRect(0, 0, this.container.offsetWidth, this.container.offsetHeight);

        this.particles.forEach(particle => {
            const dx = particle.x - particle.originalX;
            const dy = particle.y - particle.originalY;
            const isMoved = Math.sqrt(dx * dx + dy * dy) > 0.5;

            if (isMoved && particle.transition > 0.1) {
                this.overlayCtx.fillStyle = particle.color;
                this.overlayCtx.fillRect(
                    particle.x - particle.size / 2,
                    particle.y - particle.size / 2,
                    particle.size,
                    particle.size
                );
            }
        });
    }

    resetParticles() {
        this.overlayCtx.clearRect(0, 0, this.container.offsetWidth, this.container.offsetHeight);
    }

    animate() {
        if (!this.isActive) return;

        this.updateParticles();
        this.renderParticles();
        requestAnimationFrame(() => this.animate());
    }

    onResize() {
        if (this.canvas && this.img.complete) {
            this.setupCanvases();
            this.renderBackground();
            this.createParticles();
            this.resetParticles();
        }
    }
}

//init
document.addEventListener('DOMContentLoaded', () => {
    const effect = new PixelDisplacementEffect('webgl-home', 'img_/bg.jpg');

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            effect.onResize();
        }, 250);
    });
});