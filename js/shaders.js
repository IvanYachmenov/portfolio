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
        this.gridSize = 8;
        this.radius = 35;
        this.maxDisplacement = 70;

        this.init();
    }

    init() {
        if (!this.container) return;

        this.container.classList.remove('shader-ready');
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
        this.overlayCanvas.style.pointerEvents = 'none';
        this.container.appendChild(this.overlayCanvas);

        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.loading = 'eager';
        this.img.fetchPriority = 'high';
        this.img.onload = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.setupCanvases();
                    this.createParticles();
                    this.renderBackground();
                    this.container.classList.add('shader-ready');
                    if (this._checkInitialMouse) this._checkInitialMouse();
                });
            });
        };
        this.img.src = this.imageUrl;

        this.setupEventListeners();
    }

    setupCanvases() {
        const dpr = window.devicePixelRatio || 1;
        let width = this.container.offsetWidth || window.innerWidth;
        let height = this.container.offsetHeight || window.innerHeight;

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

    drawImageCover() {
        const w = this.container.offsetWidth;
        const h = this.container.offsetHeight;
        const iw = this.img.naturalWidth;
        const ih = this.img.naturalHeight;
        const r = Math.max(w / iw, h / ih);
        const sw = iw * r;
        const sh = ih * r;
        const sx = (sw - w) / 2;
        const sy = (sh - h) / 2;
        this.ctx.drawImage(this.img, -sx, -sy, sw, sh);
    }

    createParticles() {
        this.particles = [];
        const w = this.container.offsetWidth;
        const h = this.container.offsetHeight;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        this.drawImageCover();
        const imgData = this.ctx.getImageData(0, 0, cw, ch);
        const d = imgData.data;

        for (let y = 0; y < h; y += this.gridSize) {
            for (let x = 0; x < w; x += this.gridSize) {
                const px = Math.min(Math.floor(x * cw / w), cw - 1);
                const py = Math.min(Math.floor(y * ch / h), ch - 1);
                const i = (py * cw + px) << 2;

                this.particles.push({
                    x: x + this.gridSize / 2,
                    y: y + this.gridSize / 2,
                    originalX: x + this.gridSize / 2,
                    originalY: y + this.gridSize / 2,
                    size: this.gridSize,
                    color: `rgb(${d[i]},${d[i+1]},${d[i+2]})`,
                    transition: 0
                });
            }
        }
    }

    setupEventListeners() {
        let rafId;
        const onMouseIn = () => {
            this.isActive = true;
            this.animate();
        };
        const onMouseOut = () => {
            this.isActive = false;
            this.resetParticles();
        };

        this.container.addEventListener('mouseenter', onMouseIn);
        this.container.addEventListener('mouseleave', onMouseOut);

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;

            if (!this.isActive) {
                this.isActive = true;
                this.animate();
            }
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                this.updateParticles();
            });
        });

        this._checkInitialMouse = () => {
            if (typeof this._lastMouseX === 'undefined') return;
            const rect = this.container.getBoundingClientRect();
            if (this._lastMouseX >= rect.left && this._lastMouseX <= rect.right &&
                this._lastMouseY >= rect.top && this._lastMouseY <= rect.bottom) {
                this.mouse.x = this._lastMouseX - rect.left;
                this.mouse.y = this._lastMouseY - rect.top;
                onMouseIn();
            }
        };

        document.addEventListener('mousemove', (e) => {
            this._lastMouseX = e.clientX;
            this._lastMouseY = e.clientY;
        });
    }

    updateParticles() {
        if (!this.isActive) return;

        const r = this.radius;
        const maxD = this.maxDisplacement;

        this.particles.forEach(particle => {
            const dx = particle.originalX - this.mouse.x;
            const dy = particle.originalY - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < r) {
                const t = 1 - distance / r;
                const force = Math.pow(t, 1.2);
                const angle = Math.atan2(dy, dx);
                const displacement = force * maxD;

                particle.x = particle.originalX + Math.cos(angle) * displacement;
                particle.y = particle.originalY + Math.sin(angle) * displacement;
                particle.transition = Math.min(particle.transition + 0.35, 1);
            } else {
                particle.transition = Math.max(particle.transition - 0.12, 0);
                const returnSpeed = 0.18;

                particle.x += (particle.originalX - particle.x) * returnSpeed;
                particle.y += (particle.originalY - particle.y) * returnSpeed;
            }
        });
    }

    renderBackground() {
        const w = this.container.offsetWidth;
        const h = this.container.offsetHeight;
        this.ctx.clearRect(0, 0, w, h);
        this.drawImageCover();
    }

    renderParticles() {
        this.overlayCtx.clearRect(0, 0, this.container.offsetWidth, this.container.offsetHeight);

        this.particles.forEach(particle => {
            const dx = particle.x - particle.originalX;
            const dy = particle.y - particle.originalY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const isMoved = dist > 0.3;

            if (isMoved && particle.transition > 0.08) {
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

window.PixelDisplacementEffect = PixelDisplacementEffect;
