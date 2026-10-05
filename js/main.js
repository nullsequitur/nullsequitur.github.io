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
    
    const availableCommands = ['whoami', 'skills', 'clear', 'help'];

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
        // If clicking outside terminal block, close it
        if (isTerminalOpen && !terminalBlock.contains(e.target)) {
            closeTerminal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!isTerminalOpen) return;
        
        // Ignore if modifier keys are pressed
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        
        if (e.key === 'Escape') {
            closeTerminal();
            e.preventDefault();
            return;
        }

        // Prevent default page scrolling when pressing space or arrows
        if ([' ', 'Spacebar', 'ArrowUp', 'ArrowDown'].includes(e.key) || e.key === 'Tab') {
            e.preventDefault();
        }

        if (e.key === 'Enter') {
            if (currentInput.trim() !== '') {
                commandHistory.push(currentInput.trim());
                historyIndex = commandHistory.length;
                executeCommand(currentInput.trim());
            } else {
                executeCommand('');
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

    function executeCommand(cmd) {
        if (cmd === 'clear') {
            termContent.innerHTML = '';
            return;
        }

        let newBlock = document.createElement('div');
        newBlock.innerHTML = `<div class="term-line"><span class="prompt"><span class="pastel-blue">∅</span><span class="pastel-grey">＞</span> </span> <span class="command">${cmd}</span></div>`;
        termContent.appendChild(newBlock);

        if (cmd === '') return;

        let outputBlock = document.createElement('div');
        outputBlock.className = 'cmd-output';
        cmd = cmd.toLowerCase();

        if (cmd === 'whoami') {
            outputBlock.innerHTML = `
                <p><span class="key">name:</span>  <span class="glow-text">Lampros Trifyllis</span></p>
                <p><span class="key">role:</span>  Computational Physicist (PhD)</p>
                <p><span class="key">focus:</span>  Symbolic Calculations, Automation, Linux</p>
            `;
        } else if (cmd === 'skills') {
            outputBlock.innerHTML = `
                <p><span class="key">languages:</span> Python, Bash, C++, Mathematica</p>
                <p><span class="key">tools:</span> Git, Docker, LaTeX</p>
                <p><span class="key">os:</span> Arch Linux, Debian</p>
            `;
        } else if (cmd === 'help') {
            outputBlock.innerHTML = `
                <p>Available commands: <span class="glow-text">whoami</span>, <span class="glow-text">skills</span>, <span class="glow-text">clear</span>, <span class="glow-text">help</span></p>
            `;
        } else {
            outputBlock.innerHTML = `<p>Command not recognized. Type "help" to see available commands.</p>`;
        }
        termContent.appendChild(outputBlock);
    }

    // Interactive Commands
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-cmd')) {
            const cmd = e.target.getAttribute('data-cmd');
            executeCommand(cmd);
        }
    });

    // Intersection Observer for cards
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
