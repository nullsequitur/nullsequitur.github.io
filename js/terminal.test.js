/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { initTerminal } from './terminal.js';
import { Store } from './store.js';

describe('Terminal Module', () => {
    beforeEach(() => {
        Store.reset();
        document.body.innerHTML = `
            <div id="terminal-block">
                <div id="terminal-header"></div>
                <div id="term-body">
                    <input type="text" id="terminal-input">
                    <div id="term-content"></div>
                    <div id="term-active">
                        <span id="prompt-path"></span>
                        <span class="prompt"></span>
                        <span id="active-cmd"></span>
                        <span id="active-cursor">█</span>
                    </div>
                </div>
            </div>
        `;
    });

    test('initTerminal sets prompt path without double tilde', () => {
        initTerminal();
        const promptPath = document.getElementById('prompt-path');
        expect(promptPath.textContent).toBe('~');
    });

    test('focus and blur on terminalInput update activeCursor without throwing ReferenceError', () => {
        initTerminal();
        const terminalInput = document.getElementById('terminal-input');
        const activeCursor = document.getElementById('active-cursor');

        expect(() => {
            terminalInput.dispatchEvent(new Event('focus'));
        }).not.toThrow();
        expect(activeCursor.textContent).toBe('█');

        expect(() => {
            terminalInput.dispatchEvent(new Event('blur'));
        }).not.toThrow();
        expect(activeCursor.textContent).toBe('□');
    });
});
