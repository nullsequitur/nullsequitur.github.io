export function getSavedTheme() {
    return localStorage.getItem('theme');
}

export function getCurrentTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
}

export function setTheme(theme) {
    const validThemes = ['mocha', 'latte', 'gruvbox-light'];
    if (validThemes.includes(theme)) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
}

export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const crtMode = localStorage.getItem('crtMode') || 'hard';
    document.body.setAttribute('data-crt', crtMode);
}

// Automatically apply theme on load and register listener
if (typeof document !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (document.body) {
        const crtMode = localStorage.getItem('crtMode') || 'hard';
        document.body.setAttribute('data-crt', crtMode);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
}
