import { availableCommands, executeCommand } from './commands.js';
import * as fs from './filesystem.js';

export function initTerminal() {
    const terminalBlock = document.getElementById('terminal-block');
    const terminalHeader = document.getElementById('terminal-header');
    const terminalBody = document.getElementById('term-body');
    const termContent = document.getElementById('term-content');
    const terminalInput = document.getElementById('terminal-input');
    const activeCmd = document.getElementById('active-cmd');
    const activeCursor = document.getElementById('active-cursor');
    const ghostText = document.getElementById('ghost-text');
    const promptPath = document.getElementById('prompt-path');
    
    let isTerminalOpen = false;
    let commandHistory = [];
    let historyIndex = -1;

    function updatePromptPath() {
        const currentPath = fs.getCurrentDirectory();
        promptPath.textContent = currentPath === '/' ? '~' : '~' + currentPath;
    }
    
    function updateGhostText() {
        if (terminalInput.value.length === 0) {
            ghostText.style.display = 'inline';
        } else {
            ghostText.style.display = 'none';
        }
    }

    function openTerminal(e) {
        if (e) e.stopPropagation();
        terminalBlock.classList.remove('closed');
        isTerminalOpen = true;
        activeCursor.style.animation = 'cursor-blink 1s step-end infinite';
        terminalInput.focus();
    }

    function closeTerminal() {
        terminalBlock.classList.add('closed');
        isTerminalOpen = false;
        activeCursor.style.animation = 'none';
        terminalInput.blur();
    }

    terminalHeader.addEventListener('click', openTerminal);
    
    terminalBody.addEventListener('click', () => {
        if (isTerminalOpen) {
            terminalInput.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (isTerminalOpen && !terminalBlock.contains(e.target)) {
            closeTerminal();
        }
    });

    terminalInput.addEventListener('input', () => {
        activeCmd.textContent = terminalInput.value;
        updateGhostText();
    });

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const currentInput = terminalInput.value;
            if (currentInput.trim() !== '') {
                commandHistory.push(currentInput.trim());
                historyIndex = commandHistory.length;
                executeCommand(currentInput.trim(), termContent);
                updatePromptPath();
            } else {
                executeCommand('', termContent);
            }
            terminalInput.value = '';
            activeCmd.textContent = '';
            updateGhostText();
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const currentInput = terminalInput.value;
            if (currentInput.trim() === '') return;

            const parts = currentInput.split(' ');
            
            if (parts.length === 1) {
                const matches = availableCommands.filter(c => c.startsWith(parts[0].toLowerCase()));
                if (matches.length === 1) {
                    terminalInput.value = matches[0] + ' ';
                    activeCmd.textContent = terminalInput.value;
                    updateGhostText();
                }
            } else {
                const partialPath = parts[parts.length - 1];
                const matches = fs.getCompletions(fs.getCurrentDirectory(), partialPath);
                if (matches.length === 1) {
                    parts[parts.length - 1] = matches[0];
                    terminalInput.value = parts.join(' ');
                    activeCmd.textContent = terminalInput.value;
                    updateGhostText();
                }
            }
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
                activeCmd.textContent = terminalInput.value;
                updateGhostText();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
                activeCmd.textContent = terminalInput.value;
                updateGhostText();
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
                activeCmd.textContent = '';
                updateGhostText();
            }
            return;
        }
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-cmd')) {
            const cmd = e.target.getAttribute('data-cmd');
            executeCommand(cmd, termContent);
            updatePromptPath();
        }
    });
    
    updatePromptPath();
}
