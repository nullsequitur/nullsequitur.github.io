/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
    initSettings,
    renderMenu,
    handleSettingsKeydown,
    toggleSetting,
    settingsOptions,
    currentMenuIndex,
    exitSettings
} from './settings-tui.js';
import { Store } from './store.js';

describe('Settings TUI Module', () => {
    let termContent;

    beforeEach(() => {
        Store.reset();
        document.body.innerHTML = `
            <div id="term-body">
                <input type="text" id="terminal-input">
                <div id="term-content"></div>
                <div id="term-active" style="display: none;"></div>
            </div>
        `;
        termContent = document.getElementById('term-content');
        localStorage.clear();
    });

    test('settingsOptions includes return as the last option', () => {
        expect(settingsOptions[settingsOptions.length - 1]).toBe('return');
        expect(settingsOptions).toEqual(['theme', 'crt', 'cursor', 'fontsize', 'return']);
    });

    test('renders Return as the last menu row', () => {
        initSettings(termContent, '<div>Old Terminal</div>');
        const rows = termContent.querySelectorAll('.tui-row');
        expect(rows.length).toBe(5);
        expect(rows[4].textContent).toContain('Return');
    });

    test('handleSettingsKeydown navigates with j (down) and k (up)', () => {
        initSettings(termContent, '<div>Old Terminal</div>');
        const exitCb = vi.fn();

        // Initially index 0 (Theme)
        expect(termContent.querySelector('.tui-row.active').textContent).toContain('Theme');

        // Press 'j' to go down to index 1 (CRT Scanlines)
        handleSettingsKeydown(new KeyboardEvent('keydown', { key: 'j' }), exitCb);
        expect(termContent.querySelector('.tui-row.active').textContent).toContain('CRT Scanlines');

        // Press 'j' twice to go to index 3 (Font Size)
        handleSettingsKeydown(new KeyboardEvent('keydown', { key: 'j' }), exitCb);
        handleSettingsKeydown(new KeyboardEvent('keydown', { key: 'j' }), exitCb);
        expect(termContent.querySelector('.tui-row.active').textContent).toContain('Font Size');

        // Press 'j' to go to index 4 (Return)
        handleSettingsKeydown(new KeyboardEvent('keydown', { key: 'j' }), exitCb);
        expect(termContent.querySelector('.tui-row.active').textContent).toContain('Return');

        // Press 'k' to go back up to index 3 (Font Size)
        handleSettingsKeydown(new KeyboardEvent('keydown', { key: 'k' }), exitCb);
        expect(termContent.querySelector('.tui-row.active').textContent).toContain('Font Size');
    });

    test('clicking a setting row toggles the setting (smartphone support)', () => {
        initSettings(termContent, '<div>Old Terminal</div>');
        const themeRow = termContent.querySelectorAll('.tui-row')[0];

        expect(Store.currentTheme).toBe('mocha');
        themeRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(Store.currentTheme).toBe('latte');
    });

    test('clicking Return row exits the settings menu (smartphone support)', () => {
        const exitCb = vi.fn();
        initSettings(termContent, '<div>Saved Terminal Output</div>', exitCb);

        const returnRow = termContent.querySelectorAll('.tui-row')[4];
        expect(returnRow.textContent).toContain('Return');

        returnRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(exitCb).toHaveBeenCalledWith('<div>Saved Terminal Output</div>');
    });

    test('pressing Enter on Return row exits settings menu', () => {
        const exitCb = vi.fn();
        initSettings(termContent, '<div>Saved Terminal Output</div>', exitCb);

        // Move to Return (index 4) by pressing 'k' (wraps from 0 to 4)
        handleSettingsKeydown(new KeyboardEvent('keydown', { key: 'k' }), exitCb);
        expect(termContent.querySelector('.tui-row.active').textContent).toContain('Return');

        // Press Enter
        handleSettingsKeydown(new KeyboardEvent('keydown', { key: 'Enter' }), exitCb);
        expect(exitCb).toHaveBeenCalledWith('<div>Saved Terminal Output</div>');
    });

    test('pressing q or Escape exits settings menu', () => {
        const exitCb = vi.fn();
        initSettings(termContent, '<div>Saved Terminal Output</div>', exitCb);

        handleSettingsKeydown(new KeyboardEvent('keydown', { key: 'q' }), exitCb);
        expect(exitCb).toHaveBeenCalledWith('<div>Saved Terminal Output</div>');
    });
});
