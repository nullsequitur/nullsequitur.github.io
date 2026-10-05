import { availableCommands, executeCommand, printMessageAndPrompt } from './commands.js';
import * as fs from './filesystem.js';
import { handleSettingsKeydown } from './settings-tui.js';

export let terminalMode = 'command';

export function setTerminalMode(mode) {
    terminalMode = mode;
}

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
    const termActive = document.getElementById('term-active');
    
    let isTerminalOpen = false;
    let commandHistory = [];
    let historyIndex = -1;

    function updatePromptPath() {
        const currentPath = fs.getCurrentDirectory();
        promptPath.textContent = currentPath === '/' ? '~' : '~' + currentPath;
    }
    
    function updateGhostText() {
        if (terminalInput.value.length === 0) {
            ghostText.textContent = 'help';
            ghostText.style.display = 'inline';
            ghostText.style.color = '#888';
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

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isTerminalOpen) {
                openTerminal(null);
            }
            executeCommand('settings', termContent);
            updatePromptPath();
            terminalBody.scrollTop = terminalBody.scrollHeight;
        });
    }

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
        if (terminalMode === 'tui') {
            e.preventDefault();
            handleSettingsKeydown(e, (savedHTML) => {
                termContent.innerHTML = savedHTML;
                termActive.style.display = 'block';
                terminalBody.scrollTop = terminalBody.scrollHeight;
                setTerminalMode('command');
            });
            return;
        }

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
            
            if (currentInput === '') {
                const availableCommandsStr = availableCommands.sort().join('  ');
                printMessageAndPrompt(availableCommandsStr, currentInput, termContent);
                terminalBody.scrollTop = terminalBody.scrollHeight;
                return;
            }

            const parts = currentInput.split(' ');
            
            if (parts.length === 1) {
                const matches = availableCommands.filter(c => c.startsWith(parts[0].toLowerCase()));
                if (matches.length === 1) {
                    terminalInput.value = matches[0] + ' ';
                    activeCmd.textContent = terminalInput.value;
                    updateGhostText();
                } else if (matches.length > 1) {
                    printMessageAndPrompt(matches.sort().join('  '), currentInput, termContent);
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            } else {
                const partialPath = parts[parts.length - 1];
                const matches = fs.getCompletions(fs.getCurrentDirectory(), partialPath);
                if (matches.length === 1) {
                    parts[parts.length - 1] = matches[0];
                    terminalInput.value = parts.join(' ');
                    activeCmd.textContent = terminalInput.value;
                    updateGhostText();
                } else if (matches.length > 1) {
                    printMessageAndPrompt(matches.sort().join('  '), currentInput, termContent);
                    terminalBody.scrollTop = terminalBody.scrollHeight;
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

    // Boot Sequence
    terminalInput.disabled = true;
    const bootCmd = 'fetch';
    let bootCharIdx = 0;

    function typeBootChar() {
        if (bootCharIdx < bootCmd.length) {
            terminalInput.value += bootCmd.charAt(bootCharIdx);
            activeCmd.textContent = terminalInput.value;
            updateGhostText();
            bootCharIdx++;
            setTimeout(typeBootChar, 100);
        } else {
            setTimeout(() => {
                executeCommand(terminalInput.value, termContent);
                terminalInput.value = '';
                activeCmd.textContent = '';
                updatePromptPath();
                updateGhostText();
                terminalInput.disabled = false;
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 200);
        }
    }
    
    // Start boot sequence slightly after load or immediately
    setTimeout(typeBootChar, 100);
}
