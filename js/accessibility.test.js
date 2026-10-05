/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

describe('Accessibility & Meta Tags (Task 3.2)', () => {
    let htmlContent;
    let cssContent;
    let doc;

    beforeAll(() => {
        const htmlPath = path.resolve(__dirname, '../index.html');
        htmlContent = fs.readFileSync(htmlPath, 'utf8');

        const cssPath = path.resolve(__dirname, '../css/style.css');
        cssContent = fs.readFileSync(cssPath, 'utf8');

        const parser = new DOMParser();
        doc = parser.parseFromString(htmlContent, 'text/html');
    });

    describe('HTML Meta and Head Elements', () => {
        test('has meta description tag with correct content', () => {
            const metaDesc = doc.querySelector('meta[name="description"]');
            expect(metaDesc).not.toBeNull();
            expect(metaDesc.getAttribute('content')).toBe(
                'Personal portfolio and interactive terminal of Lampros Trifyllis, Computational Physicist.'
            );
        });

        test('has meta author tag', () => {
            const metaAuthor = doc.querySelector('meta[name="author"]');
            expect(metaAuthor).not.toBeNull();
            expect(metaAuthor.getAttribute('content')).toBe('Lampros Trifyllis');
        });

        test('has Open Graph tags', () => {
            const ogTitle = doc.querySelector('meta[property="og:title"]');
            const ogDesc = doc.querySelector('meta[property="og:description"]');
            const ogType = doc.querySelector('meta[property="og:type"]');
            const ogUrl = doc.querySelector('meta[property="og:url"]');

            expect(ogTitle).not.toBeNull();
            expect(ogTitle.getAttribute('content')).toBe('Lampros Trifyllis | nullsequitur');

            expect(ogDesc).not.toBeNull();
            expect(ogDesc.getAttribute('content')).toBe(
                'Personal portfolio and interactive terminal of Lampros Trifyllis, Computational Physicist.'
            );

            expect(ogType).not.toBeNull();
            expect(ogType.getAttribute('content')).toBe('website');

            expect(ogUrl).not.toBeNull();
            expect(ogUrl.getAttribute('content')).toBe('https://nullsequitur.github.io');
        });

        test('has inline SVG favicon data URI', () => {
            const favicon = doc.querySelector('link[rel="icon"]');
            expect(favicon).not.toBeNull();
            expect(favicon.getAttribute('href')).toContain('data:image/svg+xml');
            expect(favicon.getAttribute('href')).toContain('∅');
        });
    });

    describe('Accessibility Attributes & Markup', () => {
        test('has skip-to-content link right after body', () => {
            const firstChild = doc.body.firstElementChild;
            expect(firstChild.classList.contains('skip-link')).toBe(true);
            expect(firstChild.getAttribute('href')).toBe('#home-section');
            expect(firstChild.textContent.trim()).toBe('Skip to main content');
        });

        test('terminal-block has role="application" and aria-label="Terminal"', () => {
            const terminalBlock = doc.querySelector('.terminal-block');
            expect(terminalBlock).not.toBeNull();
            expect(terminalBlock.getAttribute('role')).toBe('application');
            expect(terminalBlock.getAttribute('aria-label')).toBe('Terminal');
        });

        test('#term-content has aria-live="polite"', () => {
            const termContent = doc.querySelector('#term-content');
            expect(termContent).not.toBeNull();
            expect(termContent.getAttribute('aria-live')).toBe('polite');
        });

        test('all anchor and button elements have discernible text', () => {
            const linksAndButtons = doc.querySelectorAll('a, button');
            expect(linksAndButtons.length).toBeGreaterThan(0);
            linksAndButtons.forEach(el => {
                const text = el.textContent.trim() || el.getAttribute('aria-label');
                expect(text).toBeTruthy();
            });
        });
    });

    describe('CSS Styles', () => {
        test('css includes .skip-link styles for hidden/focus states', () => {
            expect(cssContent).toMatch(/\.skip-link\s*\{/);
            expect(cssContent).toMatch(/\.skip-link:(?:focus|focus-visible)/);
        });

        test('css includes :focus-visible rules for keyboard navigation', () => {
            expect(cssContent).toMatch(/:focus-visible\s*\{[^}]*outline:/);
        });

        test('css includes @media (prefers-reduced-motion: reduce) disabling animations and scanlines', () => {
            expect(cssContent).toMatch(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/);
            expect(cssContent).toMatch(/animation:\s*none\s*!important/);
            expect(cssContent).toMatch(/transition:\s*none\s*!important/);
            expect(cssContent).toMatch(/body::after\s*\{[^}]*display:\s*none\s*!important/);
        });
    });
});
