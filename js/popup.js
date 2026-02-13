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
            { type: 'video', src: 'media/projects/p1/demo.mp4' }
        ],
        description: 'Full-stack e-learning platform (React, Django REST Framework, PostgreSQL, OAuth 2.0) with course enrollment, different types of test questions and timed/untimed quizzes. Role-based access for student/teacher workflows, progress and attempt history tracking, media uploads, profile and UI customization. Developed using Feature-Sliced Design.',
        technologies: 'React, TypeScript, Django REST Framework, Django-allauth, JWT Authentication, PostgreSQL',
        features: 'Role-based access (student/teacher), course enrollment, timed/untimed quizzes, progress tracking, attempt history, media uploads, profile customization, OAuth 2.0 social login',
        github: 'https://github.com/IvanYachmenov/elearning_app',
        demo: '#'
    },
    'code-sharing': {
        title: 'Code Sharing Platform',
        media: [
            { type: 'image', src: 'media/projects/p2/code_sharing_home.png' },
            { type: 'image', src: 'media/projects/p2/code_sharing_create.png' },
            { type: 'image', src: 'media/projects/p2/code_sharing_snippet.png' },
            { type: 'image', src: 'media/projects/p2/code_sharing_view_latests.png' },
            { type: 'image', src: 'media/projects/p2/code_sharing_api_test.png' },
            { type: 'video', src: 'media/projects/p2/demo.mp4' }
        ],
        description: 'Modern web application for sharing code snippets via UUID links with optional time-based and view-based restrictions. Includes a "latest snippets" feed and API health check. Clean REST API with layered backend structure and responsive Angular UI. In-memory H2 database.',
        technologies: 'Angular, TypeScript, Spring Boot, H2',
        features: 'UUID-based sharing, time/view restrictions, latest snippets feed, API health check, layered backend, responsive UI',
        github: 'https://github.com/IvanYachmenov/code_sharing_app',
        demo: '#'
    },
    'insurance-company-oop': {
        title: 'Insurance Company',
        media: [
            { type: 'image', src: 'media/projects/p3/insurance.png', class: 'gallery-media-constrained' }
        ],
        description: 'Java-based insurance company domain model — university course project. Implemented from a provided PDF specification and baseline UML model. Applies OOP principles and TDD with unit tests. Validates required behavior through tests. Library only, no UI or persistence.',
        technologies: 'Java, OOP, Maven, JUnit',
        withoutFeatures: true,
        github: 'https://github.com/IvanYachmenov/insurance_company',
        demo: '#'
    },
    'realtime-chat-app': {
        title: 'Real-time Chat',
        media: [
            { type: 'image', src: 'media/projects/p4/avatar.png' }
        ],
        description: 'Real-time chat application (MERN, Socket.IO). Secure authentication, group chats, online presence, typing indicators, instant messaging. Emphasis on reliable real-time delivery and scalable architecture for persistent connections.',
        technologies: 'React, Node.js, Express, MongoDB, Socket.IO',
        features: 'Group chats, online presence, typing indicators, instant messaging, secure authentication, scalable architecture',
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
            openPopup(projectData, projectId);
        }
    })
})

let currentMediaIndex = 0;
let currentProjectMedia = [];

function openPopup(project, projectId) {
    if (projectId) sessionStorage.setItem('lastOpenProject', projectId);
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
    let firstMediaElement = null;

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
                if (index === 0) firstMediaElement = video;
            } else {
                const img = document.createElement('img');
                img.src = media.src;
                img.alt = project.title;
                img.className = media.class ? 'gallery-media ' + media.class : 'gallery-media';
                mediaElement.appendChild(img);
                if (index === 0) firstMediaElement = img;
            }

            galleryTrack.appendChild(mediaElement);
        });

        galleryTotal.textContent = currentProjectMedia.length;
        updateGalleryDisplay();
    }

    popupTitle.textContent = project.title;
    popupDesc.textContent = project.description;
    const techRow = popupTech.closest('p');
    const featuresRow = popupFeatures.closest('p');
    techRow.style.display = '';
    popupTech.textContent = project.technologies || '';
    if (project.withoutFeatures) {
        featuresRow.style.display = 'none';
    } else {
        featuresRow.style.display = '';
        popupFeatures.textContent = project.features || '';
    }
    githubLink.href = project.github;

    demoLink.href = '#';
    demoLink.classList.add('disabled');
    demoLink.setAttribute('title', 'Currently unavailable');
    demoLink.onclick = (e) => e.preventDefault();

    const showPopup = () => {
        currentMediaIndex = 0;
        const track = popup.querySelector('.gallery-track');
        if (track) {
            track.style.transform = 'translateX(0)';
            const items = track.querySelectorAll('.gallery-item');
            items.forEach((item, i) => item.classList.toggle('active', i === 0));
        }
        const galleryCurrent = popup.querySelector('.gallery-current');
        if (galleryCurrent) galleryCurrent.textContent = '1';
        const popupContent = popup.querySelector('.popup-content');
        if (popupContent) popupContent.scrollTop = 0;
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                popup.classList.add('active');
                if (popupContent) popupContent.scrollTop = 0;
            });
        });
    };

    if (firstMediaElement) {
        const onReady = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(showPopup);
            });
        };
        if (firstMediaElement.tagName === 'IMG') {
            if (firstMediaElement.complete) {
                onReady();
            } else {
                firstMediaElement.addEventListener('load', onReady);
                firstMediaElement.addEventListener('error', onReady);
            }
        } else {
            firstMediaElement.addEventListener('loadeddata', onReady);
            firstMediaElement.addEventListener('error', onReady);
            setTimeout(onReady, 500);
        }
    } else {
        showPopup();
    }
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
    sessionStorage.removeItem('lastOpenProject');
    const popup = document.querySelector('.popup-wrapper');
    const popupContent = popup.querySelector('.popup-content');
    if (popupContent) popupContent.scrollTop = 0;
    currentMediaIndex = 0;

    popup.classList.remove('active');
    popup.classList.add('closing');

    setTimeout(() => {
        popup.style.display = 'none';
        popup.classList.remove('closing');
        document.body.style.overflow = 'auto';
    }, 800);
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