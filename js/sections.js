import * as fs from './filesystem.js';

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
        dir = '/';
    } else if (!targetPath.startsWith('/')) {
        dir = '/' + targetPath;
    }

    try {
        fs.setCurrentDirectory(dir);
    } catch (e) {
        console.error(e);
        return;
    }

    // Hide all sections and terminal
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    const terminalBlock = document.getElementById('terminal-block');
    if (terminalBlock) terminalBlock.classList.remove('active');

    // Show the target section or terminal
    if (isRoot) {
        if (terminalBlock) terminalBlock.classList.add('active');
    } else {
        const sectionName = targetPath.replace(/^\//, '');
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            // Fallback to home/terminal if section not found
            if (terminalBlock) terminalBlock.classList.add('active');
        }
    }
}

export function initSections() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('nav a, a.btn, .logo a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = href.substring(1);
            if (target === 'home') {
                import('./terminal.js').then(m => m.resetTerminal());
            }
            navigateTo(target);
        } else if (href.endsWith('/')) {
            e.preventDefault();
            navigateTo(href.replace(/\/$/, ''));
        }
    });

    // Listen for custom cd event
    document.addEventListener('cd', (e) => {
        navigateTo(e.detail);
    });
}
