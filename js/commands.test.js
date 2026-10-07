/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';

const mockFs = {
    getCurrentDirectory: vi.fn(),
    setCurrentDirectory: vi.fn(),
    listDirectory: vi.fn(),
    isDirectory: vi.fn(),
    isFile: vi.fn(),
    getNode: vi.fn()
};

const mockContent = {
    siteData: {
        user: {
            name: 'Lampros Trifyllis',
            role: 'AI Engineer | Systems Developer | Theoretical Physicist',
            focus: 'Agentic Workflows, RAG, Formal Verification',
            email: 'test@example.com',
            github: 'https://github.com/test',
            linkedin: 'https://linkedin.com/in/test'
        },
        skills: {
            ai: ['RAG Architecture', 'Agentic Harnesses'],
            sys: ['Docker', 'Arch Linux'],
            academic: ['Theoretical Physics', 'LaTeX'],
            languages: ['Python', 'Bash']
        }
    }
};

vi.mock('./filesystem.js', () => mockFs);
vi.mock('./content.js', () => mockContent);

const { availableCommands, executeCommand } = await import('./commands.js');
const fs = await import('./filesystem.js');

describe('Terminal Commands', () => {
    let termContent;

    beforeEach(() => {
        termContent = document.createElement('div');
        vi.clearAllMocks();
    });

    test('availableCommands list is correct', () => {
        const expectedCmds = ['whoami', 'skills', 'clear', 'help', 'ls', 'cd', 'cat', 'pwd', 'contact', 'settings', 'fetch'];
        expect(availableCommands).toEqual(expect.arrayContaining(expectedCmds));
        expect(availableCommands.length).toBe(11);
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
        expect(termContent.textContent).toContain('AI Engineer');
        expect(termContent.textContent).toContain('Theoretical Physicist');
    });

    test('skills command displays all skills without flags', () => {
        executeCommand('skills', termContent);
        expect(termContent.textContent).toContain('languages: Python, Bash');
        expect(termContent.textContent).toContain('ai: RAG Architecture, Agentic Harnesses');
        expect(termContent.textContent).toContain('sys: Docker, Arch Linux');
        expect(termContent.textContent).toContain('academic: Theoretical Physics, LaTeX');
    });

    test('skills command displays specific category with flags', () => {
        executeCommand('skills --ai', termContent);
        expect(termContent.textContent).toContain('ai: RAG Architecture, Agentic Harnesses');
        expect(termContent.textContent).not.toContain('languages: Python');
        expect(termContent.textContent).not.toContain('sys: Docker');
        
        termContent.innerHTML = '';
        executeCommand('skills --sys', termContent);
        expect(termContent.textContent).toContain('sys: Docker, Arch Linux');
        expect(termContent.textContent).not.toContain('ai:');
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
        
        expect(spans[0].className).toBe('file-name');
        expect(spans[1].className).toBe('dir-name');
    });

    test('cd command changes directory', () => {
        fs.setCurrentDirectory.mockReturnValue(true);
        executeCommand('cd /tmp', termContent);
        expect(fs.setCurrentDirectory).toHaveBeenCalledWith('/tmp');
        expect(termContent.textContent).not.toContain('No such file or directory');
        
        fs.setCurrentDirectory.mockImplementation(() => { throw new Error('cd: /invalid: No such file or directory'); });
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
