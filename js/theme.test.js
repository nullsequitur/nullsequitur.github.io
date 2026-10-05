/**
 * @jest-environment jsdom
 */

import { initTheme, toggleTheme, setTheme, getCurrentTheme } from './theme.js';

describe('Theme module', () => {
    let toggleBtn;

    beforeEach(() => {
        // Reset DOM and localStorage
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
        document.body.innerHTML = `
            <header class="navbar">
                <button id="theme-toggle" class="btn" aria-label="Toggle theme">🌓</button>
            </header>
        `;
        toggleBtn = document.getElementById('theme-toggle');
    });

    test('initializes with theme from localStorage if present', () => {
        localStorage.setItem('theme', 'light');
        initTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('initializes with dark theme if saved in localStorage', () => {
        localStorage.setItem('theme', 'dark');
        initTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('defaults to dark when no theme in localStorage and no light preference', () => {
        initTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();
        expect(getCurrentTheme()).toBe('dark');
    });

    test('toggles from dark to light on click and saves to localStorage', () => {
        initTheme();
        toggleBtn.click();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(localStorage.getItem('theme')).toBe('light');
    });

    test('toggles from light to dark on click and saves to localStorage', () => {
        localStorage.setItem('theme', 'light');
        initTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');

        toggleBtn.click();
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('setTheme correctly updates attribute and localStorage', () => {
        setTheme('light');
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(localStorage.getItem('theme')).toBe('light');

        setTheme('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('toggleTheme switches back and forth repeatedly', () => {
        initTheme();
        const firstToggle = toggleTheme();
        expect(firstToggle).toBe('light');
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(localStorage.getItem('theme')).toBe('light');

        const secondToggle = toggleTheme();
        expect(secondToggle).toBe('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });
});
