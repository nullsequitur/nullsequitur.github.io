import { availableCommands, executeCommand } from './commands.js';

document.addEventListener('DOMContentLoaded', () => {
    const terminalBlock = document.getElementById('terminal-block');
    const terminalHeader = document.getElementById('terminal-header');
    const termContent = document.getElementById('term-content');
    const activeCmd = document.getElementById('active-cmd');
    const activeCursor = document.getElementById('active-cursor');
    const ghostText = document.getElementById('ghost-text');
    
    let isTerminalOpen = false;
    let currentInput = "";
    let commandHistory = [];
    let historyIndex = -1;
    
    function updateGhostText() {
        if (currentInput.length === 0) {
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
    }

    function closeTerminal() {
        terminalBlock.classList.add('closed');
        isTerminalOpen = false;
        activeCursor.style.animation = 'none';
    }

    terminalHeader.addEventListener('click', openTerminal);

    document.addEventListener('click', (e) => {
        if (isTerminalOpen && !terminalBlock.contains(e.target)) {
            closeTerminal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!isTerminalOpen) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        
        if (e.key === 'Escape') {
            closeTerminal();
            e.preventDefault();
            return;
        }

        if ([' ', 'Spacebar', 'ArrowUp', 'ArrowDown'].includes(e.key) || e.key === 'Tab') {
            e.preventDefault();
        }

        if (e.key === 'Enter') {
            if (currentInput.trim() !== '') {
                commandHistory.push(currentInput.trim());
                historyIndex = commandHistory.length;
                executeCommand(currentInput.trim(), termContent);
            } else {
                executeCommand('', termContent);
            }
            currentInput = '';
            activeCmd.textContent = '';
            updateGhostText();
            return;
        }

        if (e.key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            activeCmd.textContent = currentInput;
            updateGhostText();
            return;
        }

        if (e.key === 'Tab') {
            const matches = availableCommands.filter(c => c.startsWith(currentInput.toLowerCase()));
            if (matches.length === 1) {
                currentInput = matches[0];
                activeCmd.textContent = currentInput;
                updateGhostText();
            }
            return;
        }

        if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                currentInput = commandHistory[historyIndex];
                activeCmd.textContent = currentInput;
                updateGhostText();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                currentInput = commandHistory[historyIndex];
                activeCmd.textContent = currentInput;
                updateGhostText();
            } else {
                historyIndex = commandHistory.length;
                currentInput = '';
                activeCmd.textContent = '';
                updateGhostText();
            }
            return;
        }

        if (e.key.length === 1) {
            currentInput += e.key;
            activeCmd.textContent = currentInput;
            updateGhostText();
        }
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-cmd')) {
            const cmd = e.target.getAttribute('data-cmd');
            executeCommand(cmd, termContent);
        }
    });

    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
});
