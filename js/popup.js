const projectsData = {
    'fantastic-beings': {
        title: 'Fantastic Beings',
        image: '../img_/fantastic_beings.png',
        description: 'Match-3 game in style of Candy Crush with interactive gameplay',
        technologies: 'JavaScript, HTML, CSS',
        features: 'Game effects, animations, scoring system',
        github: '#',
        demo: '#'
    },
    'project2': {
        title: 'Project Name 2',
        image: '../img_/table_pic4.jpeg',
        description: 'Description of second',
        technologies: 'React, Node.js, MongoDB',
        features: 'User authentication, real-time updates, responsive design',
        github: '#',
        demo: '#'
    },
    'project3': {
        title: 'Project Name 3',
        image: '../img_/table_pic1.jpeg',
        description: 'Description of third project',
        technologies: 'Python, Django, PostgreSQL',
        features: 'REST API, database management, admin panel',
        github: '#',
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

function openPopup(project) {
    const popup = document.querySelector('.popup-wrapper');
    const popupImg = popup.querySelector('.popup-img');
    const popupTitle = popup.querySelector('.popup-title');
    const popupDesc = popup.querySelector('.popup-desc');
    const popupTech = popup.querySelector('.popup-tech');
    const popupFeatures = popup.querySelector('.popup-features');
    const githubLink = popup.querySelector('.github-link');
    const demoLink = popup.querySelector('.demo-link');

    popupImg.src = project.image;
    popupImg.alt = project.title;
    popupTitle.textContent = project.title;
    popupDesc.textContent = project.description;
    popupTech.textContent = project.technologies;
    popupFeatures.textContent = project.features;
    githubLink.href = project.github;
    demoLink.href = project.demo;

    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
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

document.querySelector('.close-btn').addEventListener('click', closePopup);

document.querySelector('.popup-wrapper').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
});