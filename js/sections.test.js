import { describe, test, expect, beforeEach, vi } from 'vitest';
import { navigateTo, initSections } from './sections.js';

vi.mock('./filesystem.js', () => ({
  setCurrentDirectory: vi.fn(),
}));

describe('Sections Navigation', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="terminal-block" class="active"></div>
            <div id="home-section" class="content-section"></div>
            <div id="projects-section" class="content-section"></div>
        `;
        vi.clearAllMocks();
    });

    test('navigateTo home path shows terminal', () => {
        navigateTo('/');
        expect(document.getElementById('terminal-block').classList.contains('active')).toBe(true);
        expect(document.getElementById('projects-section').classList.contains('active')).toBe(false);
    });

    test('navigateTo specific path shows content section', () => {
        navigateTo('/projects');
        expect(document.getElementById('terminal-block').classList.contains('active')).toBe(false);
        expect(document.getElementById('projects-section').classList.contains('active')).toBe(true);
    });
});
