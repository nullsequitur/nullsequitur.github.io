export function resetTerminal() {
    const termContent = document.getElementById('term-content');
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('term-body');
    if (!termContent || !terminalInput) return;
    
    // Clear terminal
    import('./commands.js').then(({ executeCommand }) => {
        termContent.innerHTML = '';
        executeCommand('fetch', termContent);
        setTimeout(() => terminalInput.focus(), 10);
        if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
    });
}
import { availableCommands, executeCommand, printMessageAndPrompt } from './commands.js';
import * as fs from './filesystem.js';
import { handleSettingsKeydown } from './settings-tui.js';
import { Store } from './store.js';

export function setTerminalMode(mode) {
    Store.terminalMode = mode;
}

export function initTerminal() {
    const terminalBlock = document.getElementById('terminal-block');
    const terminalHeader = document.getElementById('terminal-header');
    const terminalBody = document.getElementById('term-body');
    const termContent = document.getElementById('term-content');
    const terminalInput = document.getElementById('terminal-input');
    const activeCmd = document.getElementById('active-cmd');
    
    const promptPath = document.getElementById('prompt-path');
    const termActive = document.getElementById('term-active');
    
    let isTerminalOpen = true;
    let historyIndex = -1;

    function updatePromptPath() {
        const currentPath = fs.getCurrentDirectory();
        promptPath.textContent = currentPath === '/' ? '~' : '~' + currentPath;
    }
    
    
    
    
    
    terminalBody.addEventListener('click', () => {
        if (true) {
            setTimeout(() => terminalInput.focus(), 10);
        }
    });

    
    
    terminalInput.addEventListener('focus', () => {
        if (activeCursor) {
            activeCursor.textContent = '█';
            activeCursor.style.animation = 'cursor-blink 1s step-end infinite';
        }
    });
    
    terminalInput.addEventListener('blur', () => {
        if (activeCursor) {
            activeCursor.textContent = '□';
            activeCursor.style.animation = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        // Don't steal focus if they are interacting with the TUI, wait, TUI is keyboard only, so yes steal focus!
        if (document.activeElement !== terminalInput) {
            setTimeout(() => terminalInput.focus(), 10);
        }
    });

    terminalInput.addEventListener('input', () => {
        activeCmd.textContent = terminalInput.value;
    });

    terminalInput.addEventListener('keydown', (e) => {
        if (Store.terminalMode === 'tui') {
            e.preventDefault();
            handleSettingsKeydown(e, (savedHTML) => {
                termContent.innerHTML = savedHTML;
                termActive.style.display = 'block';
                terminalBody.scrollTop = terminalBody.scrollHeight;
                setTerminalMode('command');
                setTimeout(() => terminalInput.focus(), 10);
            });
            return;
        }

        if (e.key === 'Enter') {
            const currentInput = terminalInput.value;
            if (currentInput.trim() !== '') {
                Store.commandHistory.push(currentInput.trim());
                historyIndex = Store.commandHistory.length;
                executeCommand(currentInput.trim(), termContent);
                updatePromptPath();
            } else {
                executeCommand('', termContent);
            }
            terminalInput.value = '';
            activeCmd.textContent = '';
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
                } else if (matches.length > 1) {
                    printMessageAndPrompt(matches.sort().join('  '), currentInput, termContent);
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            } else {
                const partialPath = parts[parts.length - 1];
                const matches = fs.getCompletions(fs.getCurrentDirectory(), partialPath);
                if (matches.length === 1) {
                    const match = matches[0];
                    if (fs.isDirectory(match)) {
                        parts[parts.length - 1] = match + '/';
                    } else {
                        parts[parts.length - 1] = match + ' ';
                    }
                    terminalInput.value = parts.join(' ');
                    activeCmd.textContent = terminalInput.value;
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
                terminalInput.value = Store.commandHistory[historyIndex];
                activeCmd.textContent = terminalInput.value;
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < Store.commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = Store.commandHistory[historyIndex];
                activeCmd.textContent = terminalInput.value;
            } else {
                historyIndex = Store.commandHistory.length;
                terminalInput.value = '';
                activeCmd.textContent = '';
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
            bootCharIdx++;
            setTimeout(typeBootChar, 50 + Math.random() * 100);
        } else {
            setTimeout(() => {
                executeCommand(terminalInput.value, termContent);
                terminalInput.value = '';
                activeCmd.textContent = '';
                updatePromptPath();
                terminalInput.disabled = false;
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 500);
        }
    }
    
    // Start boot sequence slightly after load or immediately
    setTimeout(typeBootChar, 1000);
}
