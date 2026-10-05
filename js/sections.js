import { fs } from './filesystem.js';

export function navigateTo(path) {
    // Determine target path
    let targetPath = path;
    if (path.startsWith('#')) {
        targetPath = path.substring(1);
    }
    
    // Resolve path using fs
    const isRoot = targetPath === '' || targetPath === '/' || targetPath === '~' || targetPath === 'home';
    let dir = targetPath;
    if (isRoot) {
        dir = '~';
    } else if (!targetPath.startsWith('/')) {
        dir = '/' + targetPath;
    }

    try {
        fs.setCurrentDirectory(dir);
    } catch (e) {
        console.error(e);
        return;
    }

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the target section
    const sectionName = isRoot ? 'home' : targetPath.replace(/^\//, '');
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        // Fallback to home if section not found
        const homeSection = document.getElementById('home-section');
        if (homeSection) homeSection.classList.add('active');
    }
}

// Intercept navbar links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('nav a, a.btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                navigateTo(href.substring(1));
            } else if (href.endsWith('/')) {
                // For a href="research/"
                e.preventDefault();
                navigateTo(href.replace(/\/$/, ''));
            }
        });
    });

    // Listen for custom cd event
    document.addEventListener('cd', (e) => {
        navigateTo(e.detail);
    });
});
