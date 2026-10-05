/**
 * @jest-environment jsdom
 */

import { availableCommands, executeCommand } from './commands.js';

describe('Terminal Commands', () => {
    test('availableCommands list is correct', () => {
        expect(availableCommands).toContain('whoami');
        expect(availableCommands).toContain('skills');
        expect(availableCommands).toContain('clear');
        expect(availableCommands).toContain('help');
        expect(availableCommands.length).toBe(4);
    });

    test('executeCommand renders input safely without evaluating HTML (XSS prevention)', () => {
        const termContent = document.createElement('div');
        const xssPayload = '<img src=x onerror=alert(1)>';
        executeCommand(xssPayload, termContent);

        expect(termContent.querySelector('img')).toBeNull();
        const commandSpan = termContent.querySelector('.command');
        expect(commandSpan).not.toBeNull();
        expect(commandSpan.textContent).toBe(xssPayload);
    });
});
