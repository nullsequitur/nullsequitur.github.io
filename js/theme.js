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
    if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
}

export function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getCurrentTheme();
    const nextTheme = current === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    return nextTheme;
}

export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
}

// Automatically apply theme on load and register listener
if (typeof document !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
}
