/**
 * @jest-environment jsdom
 */

import { availableCommands, executeCommand } from './commands.js';
import * as fs from './filesystem.js';
import { siteData } from './content.js';

// Mock dependencies
jest.mock('./filesystem.js', () => ({
    getCurrentDirectory: jest.fn(),
    setCurrentDirectory: jest.fn(),
    listDirectory: jest.fn(),
    isDirectory: jest.fn(),
    isFile: jest.fn(),
    getNode: jest.fn()
}));

jest.mock('./content.js', () => ({
    siteData: {
        user: {
            name: 'Lampros Trifyllis',
            role: 'Computational Physicist (PhD)',
            focus: 'Symbolic Calculations, Automation, Linux',
            email: 'test@example.com',
            github: 'https://github.com/test',
            linkedin: 'https://linkedin.com/in/test'
        },
        skills: {
            languages: ['Python', 'Bash', 'C++'],
            tools: ['Git', 'Docker'],
            os: ['Arch Linux']
        }
    }
}));

describe('Terminal Commands', () => {
    let termContent;

    beforeEach(() => {
        termContent = document.createElement('div');
        jest.clearAllMocks();
    });

    test('availableCommands list is correct', () => {
        const expectedCmds = ['whoami', 'skills', 'clear', 'help', 'ls', 'cd', 'cat', 'pwd', 'contact'];
        expect(availableCommands).toEqual(expect.arrayContaining(expectedCmds));
        expect(availableCommands.length).toBe(9);
    });

    test('executeCommand renders input safely without evaluating HTML (XSS prevention)', () => {
        const xssPayload = '<img src=x onerror=alert(1)>';
        executeCommand(xssPayload, termContent);

        expect(termContent.querySelector('img')).toBeNull();
        const commandSpan = termContent.querySelector('.command');
        expect(commandSpan).not.toBeNull();
        expect(commandSpan.textContent).toBe(xssPayload);
    });
    
    test('clear command empties the terminal', () => {
        termContent.innerHTML = '<div>Old content</div>';
        executeCommand('clear', termContent);
        expect(termContent.innerHTML).toBe('');
    });

    test('whoami command displays correct info', () => {
        executeCommand('whoami', termContent);
        expect(termContent.textContent).toContain('Lampros Trifyllis');
        expect(termContent.textContent).toContain('Computational Physicist');
    });

    test('ls command uses filesystem mock', () => {
        fs.getCurrentDirectory.mockReturnValue('/home');
        fs.listDirectory.mockReturnValue(['file1.txt', 'dir1']);
        fs.isDirectory.mockImplementation(path => path.includes('dir1'));
        
        executeCommand('ls', termContent);
        
        expect(fs.listDirectory).toHaveBeenCalledWith('/home');
        expect(termContent.textContent).toContain('file1.txt');
        expect(termContent.textContent).toContain('dir1/');
        
        const output = termContent.querySelector('.cmd-output');
        const spans = output.querySelectorAll('span');
        expect(spans.length).toBe(2);
        
        expect(spans[0].className).toBe('file-color');
        expect(spans[1].className).toBe('dir-color');
    });

    test('cd command changes directory', () => {
        fs.setCurrentDirectory.mockReturnValue(true);
        executeCommand('cd /tmp', termContent);
        expect(fs.setCurrentDirectory).toHaveBeenCalledWith('/tmp');
        expect(termContent.textContent).not.toContain('No such file or directory');
        
        fs.setCurrentDirectory.mockReturnValue(false);
        executeCommand('cd /invalid', termContent);
        expect(termContent.textContent).toContain('cd: /invalid: No such file or directory');
    });

    test('cat command prints file contents', () => {
        fs.isFile.mockReturnValue(true);
        fs.getNode.mockReturnValue({
            synopsis: 'A test file synopsis',
            url: 'https://example.com/test'
        });
        
        executeCommand('cat /test.txt', termContent);
        expect(fs.isFile).toHaveBeenCalledWith('/test.txt');
        expect(fs.getNode).toHaveBeenCalledWith('/test.txt');
        
        expect(termContent.textContent).toContain('A test file synopsis');
        expect(termContent.querySelector('a').href).toBe('https://example.com/test');
    });
    
    test('cat errors on directory or non-existent file', () => {
        fs.isFile.mockReturnValue(false);
        executeCommand('cat /invalid', termContent);
        expect(termContent.textContent).toContain('cat: /invalid: No such file or directory');
    });
});
