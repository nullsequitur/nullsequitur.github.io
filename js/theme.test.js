/**
 * @jest-environment jsdom
 */

import { initTheme, setTheme, getCurrentTheme } from './theme.js';

describe('Theme module', () => {
    beforeEach(() => {
        // Reset DOM and localStorage
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-crt');
        document.body.innerHTML = `
            <header class="navbar">
                <button id="theme-toggle" class="btn" aria-label="Toggle theme">🌓</button>
            </header>
        `;
    });

    test('initializes with theme from localStorage if present', () => {
        localStorage.setItem('theme', 'latte');
        initTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('latte');
    });

    test('initializes with crtMode from localStorage if present', () => {
        localStorage.setItem('crtMode', 'subtle');
        initTheme();
        expect(document.body.getAttribute('data-crt')).toBe('subtle');
    });

    test('setTheme correctly updates attribute and localStorage for valid themes', () => {
        setTheme('latte');
        expect(document.documentElement.getAttribute('data-theme')).toBe('latte');
        expect(localStorage.getItem('theme')).toBe('latte');


        setTheme('mocha');
        expect(document.documentElement.getAttribute('data-theme')).toBe('mocha');
        expect(localStorage.getItem('theme')).toBe('mocha');
    });

    test('setTheme ignores invalid themes', () => {
        setTheme('invalid-theme');
        expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
        expect(localStorage.getItem('theme')).toBeNull();
    });
});
