class Navigation {
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'about', 'portfolio', 'contacts'];
        this.loadedSections = new Set();
        this.mainContainer = document.querySelector('main');
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadSection('home');
        this.setupHashChange();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('#navbar a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.loadSection(sectionId);
                this.updateActiveLink(link);
            });
        });
    }

    async loadSection(sectionId) {
        try {
            const response = await fetch(`sections/${sectionId}.html`);
            const html = await response.text();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            this.mainContainer.innerHTML = '';
            
            const section = tempDiv.querySelector('section');
            const footer = tempDiv.querySelector('footer');
            
            if (section) {
                this.mainContainer.appendChild(section);
                setTimeout(() => {
                    section.classList.add('active');
                }, 10);
            }
            
            const existingFooter = document.querySelector('footer');
            if (existingFooter && sectionId !== 'contacts') {
                existingFooter.classList.remove('active');
                existingFooter.style.display = 'none';
                existingFooter.remove();
            }
            
            if (footer && sectionId === 'contacts') {
                const section = document.getElementById('contacts');
                if (section) {
                    section.appendChild(footer);
                } else {
                    document.body.appendChild(footer);
                }
                setTimeout(() => {
                    footer.classList.add('active');
                }, 10);
            }
            
            this.loadedSections.add(sectionId);
            this.currentSection = sectionId;
            
            if (sectionId === 'home') {
                window.shaderInitialized = false;
                setTimeout(() => {
                    this.initShader();
                }, 300);
            } else {
                window.shaderInitialized = false;
            }
            
            if (sectionId === 'portfolio') {
                setTimeout(() => {
                    this.initPopup();
                }, 100);
            }
        } catch (error) {
            console.error(`Error loading section ${sectionId}:`, error);
        }
    }

    initShader() {
        const container = document.getElementById('webgl-home');
        if (!container) {
            return;
        }
        
        if (window.shaderEffect) {
            try {
                if (window.shaderEffect.container) {
                    const oldContainer = window.shaderEffect.container;
                    oldContainer.innerHTML = '';
                }
            } catch(e) {}
            window.shaderEffect = null;
        }
        
        const initEffect = () => {
            const checkContainer = document.getElementById('webgl-home');
            if (!checkContainer) {
                setTimeout(initEffect, 100);
                return;
            }
            
            if (typeof PixelDisplacementEffect === 'undefined') {
                setTimeout(initEffect, 100);
                return;
            }
            
            try {
                const effect = new PixelDisplacementEffect('webgl-home', 'media/assets/bg.jpg');
                window.shaderEffect = effect;
                
                let resizeTimeout;
                const resizeHandler = () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => {
                        if (window.shaderEffect && window.shaderEffect.onResize) {
                            window.shaderEffect.onResize();
                        }
                    }, 250);
                };
                
                const oldHandler = window.shaderResizeHandler;
                if (oldHandler) {
                    window.removeEventListener('resize', oldHandler);
                }
                window.shaderResizeHandler = resizeHandler;
                window.addEventListener('resize', resizeHandler);
            } catch (error) {
                console.error('Error initializing shader:', error);
                setTimeout(initEffect, 200);
            }
        };
        
        setTimeout(initEffect, 300);
    }

    initPopup() {
        if (typeof document.querySelectorAll !== 'undefined') {
            const capsules = document.querySelectorAll('.project-capsule');
            if (capsules.length > 0 && typeof openPopup !== 'undefined') {
                capsules.forEach(capsule => {
                    capsule.addEventListener('click', function(e) {
                        if (e.target.classList.contains('open-window')) return;
                        const projectId = this.getAttribute('data-project');
                        const projectData = projectsData[projectId];
                        if (projectData) {
                            openPopup(projectData);
                        }
                    });
                });
            }
        }
    }

    updateActiveLink(activeLink) {
        const navLinks = document.querySelectorAll('#navbar a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupHashChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (this.sections.includes(hash)) {
                this.loadSection(hash);
                const link = document.querySelector(`#navbar a[href="#${hash}"]`);
                if (link) {
                    this.updateActiveLink(link);
                }
            }
        });

        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            if (this.sections.includes(hash)) {
                this.loadSection(hash);
                const link = document.querySelector(`#navbar a[href="#${hash}"]`);
                if (link) {
                    this.updateActiveLink(link);
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});
