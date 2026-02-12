const projectsData = {
    'e-learning': {
        title: 'E-Learning Web Application',
        media: [
            { type: 'image', src: 'media/projects/p1/start_page.png' },
            { type: 'image', src: 'media/projects/p1/courses_page1.png' },
            { type: 'image', src: 'media/projects/p1/courses_page2.png' },
            { type: 'image', src: 'media/projects/p1/learning_page1.png' },
            { type: 'image', src: 'media/projects/p1/theory_page.png' },
            { type: 'image', src: 'media/projects/p1/test.png' },
            { type: 'image', src: 'media/projects/p1/results_page.png' },
            { type: 'image', src: 'media/projects/p1/profile_page.png' },
            { type: 'image', src: 'media/projects/p1/course_edit_page1.png' },
            { type: 'image', src: 'media/projects/p1/course_edit_page2.png' },
            { type: 'image', src: 'media/projects/p1/course_edit_page3.png' },
            { type: 'image', src: 'media/projects/p1/teacher_courses_list.png' },
            { type: 'image', src: 'media/projects/p1/test_history_page.png' },
            { type: 'image', src: 'media/projects/p1/settings_page.png' },
            { type: 'image', src: 'media/projects/p1/login_page.png' },
            { type: 'image', src: 'media/projects/p1/nav.png' },
            { type: 'video', src: 'media/projects/p1/tutor_100mb.mp4' }
        ],
        description: 'Full-stack online learning platform developed using Feature-Sliced Design architecture. The application provides comprehensive course management, user authentication with OAuth 2.0 social login, and interactive learning features. Built with modern web technologies focusing on clean code principles and scalable architecture.',
        technologies: 'React, TypeScript, Django REST Framework, Django-allauth, JWT Authentication, MySQL',
        features: 'User authentication and authorization, OAuth 2.0 social login, course management system, interactive learning modules, real-time progress tracking, responsive design, RESTful API',
        github: 'https://github.com/IvanYachmenov/elearning_app',
        demo: '#'
    },
    'code-sharing': {
        title: 'Code Sharing Platform',
        media: [
            { type: 'image', src: 'media/assets/table_pic2.jpeg' },
            { type: 'image', src: 'media/assets/table_pic4.jpeg' },
            { type: 'image', src: 'media/assets/table_pic1.jpeg' }
        ],
        description: 'Collaborative platform for developers to share, review, and discuss code snippets. Features real-time collaboration, syntax highlighting, version control integration, and community-driven code reviews. Designed to facilitate knowledge sharing and code quality improvement.',
        technologies: 'React, TypeScript, Node.js, WebSocket, MongoDB, Git Integration',
        features: 'Real-time code sharing, syntax highlighting, code review system, version control integration, user profiles, search and filtering, comments and discussions',
        github: 'https://github.com/IvanYachmenov/code_sharing_app',
        demo: '#'
    },
    'real-time-chat': {
        title: 'Real-time Chat',
        media: [
            { type: 'image', src: 'media/assets/table_pic3.jpeg' },
            { type: 'image', src: 'media/assets/table_pic4.jpeg' }
        ],
        description: 'Real-time messaging application with instant communication, modern UI, and advanced features. Built with modern web technologies for seamless user experience and reliable message delivery.',
        technologies: 'React, TypeScript, Node.js, WebSocket, Socket.io, Express, MongoDB',
        features: 'Real-time messaging, user authentication, online/offline status, message history, file sharing, notifications, responsive design, group chats',
        github: 'https://github.com/IvanYachmenov/real-time-chat',
        demo: '#'
    }
}

document.querySelectorAll('.project-capsule').forEach(capsule => {
    capsule.addEventListener('click', function(e) {
        if (e.target.classList.contains('open-window')) return;

        const projectId = this.getAttribute('data-project');
        const projectData = projectsData[projectId];

        if (projectData) {
            openPopup(projectData);
        }
    })
})

let currentMediaIndex = 0;
let currentProjectMedia = [];

function openPopup(project) {
    const popup = document.querySelector('.popup-wrapper');
    const popupTitle = popup.querySelector('.popup-title');
    const popupDesc = popup.querySelector('.popup-desc');
    const popupTech = popup.querySelector('.popup-tech');
    const popupFeatures = popup.querySelector('.popup-features');
    const githubLink = popup.querySelector('.github-link');
    const demoLink = popup.querySelector('.demo-link');
    const galleryTrack = popup.querySelector('.gallery-track');
    const galleryCurrent = popup.querySelector('.gallery-current');
    const galleryTotal = popup.querySelector('.gallery-total');

    currentProjectMedia = project.media || [];
    currentMediaIndex = 0;

    galleryTrack.innerHTML = '';
    
    if (currentProjectMedia.length > 0) {
        currentProjectMedia.forEach((media, index) => {
            const mediaElement = document.createElement('div');
            mediaElement.className = 'gallery-item';
            mediaElement.dataset.index = index;
            
            if (media.type === 'video') {
                const video = document.createElement('video');
                video.src = media.src;
                video.controls = true;
                video.className = 'gallery-media';
                mediaElement.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = media.src;
                img.alt = project.title;
                img.className = 'gallery-media';
                mediaElement.appendChild(img);
            }
            
            galleryTrack.appendChild(mediaElement);
        });
        
        galleryTotal.textContent = currentProjectMedia.length;
        updateGalleryDisplay();
    }

    popupTitle.textContent = project.title;
    popupDesc.textContent = project.description;
    popupTech.textContent = project.technologies;
    popupFeatures.textContent = project.features;
    githubLink.href = project.github;
    
    demoLink.href = '#';
    demoLink.classList.add('disabled');
    demoLink.setAttribute('title', 'Currently unavailable');
    demoLink.addEventListener('click', (e) => {
        e.preventDefault();
    });

    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
}

function updateGalleryDisplay() {
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryCurrent = document.querySelector('.gallery-current');
    const items = galleryTrack.querySelectorAll('.gallery-item');
    
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentMediaIndex);
    });
    
    if (galleryCurrent) {
        galleryCurrent.textContent = currentMediaIndex + 1;
    }
    
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (prevBtn) prevBtn.style.display = currentProjectMedia.length > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentProjectMedia.length > 1 ? 'flex' : 'none';
}

function nextMedia() {
    if (currentProjectMedia.length > 0) {
        currentMediaIndex = (currentMediaIndex + 1) % currentProjectMedia.length;
        updateGalleryDisplay();
    }
}

function prevMedia() {
    if (currentProjectMedia.length > 0) {
        currentMediaIndex = (currentMediaIndex - 1 + currentProjectMedia.length) % currentProjectMedia.length;
        updateGalleryDisplay();
    }
}

function closePopup() {
    const popup = document.querySelector('.popup-wrapper');

    popup.classList.remove('active');
    popup.classList.add('closing');

    setTimeout(() => {
        popup.style.display = 'none';
        popup.classList.remove('closing');
        document.body.style.overflow = 'auto';
    }, 300);
}

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', closePopup);
});

const nextBtn = document.querySelector('.gallery-next');
const prevBtn = document.querySelector('.gallery-prev');

if (nextBtn) nextBtn.addEventListener('click', nextMedia);
if (prevBtn) prevBtn.addEventListener('click', prevMedia);

document.querySelector('.popup-wrapper').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
    } else if (e.key === 'ArrowLeft') {
        const popup = document.querySelector('.popup-wrapper');
        if (popup.style.display === 'flex') {
            prevMedia();
        }
    } else if (e.key === 'ArrowRight') {
        const popup = document.querySelector('.popup-wrapper');
        if (popup.style.display === 'flex') {
            nextMedia();
        }
    }
});