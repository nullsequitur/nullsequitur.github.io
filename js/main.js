document.addEventListener('DOMContentLoaded', () => {
    // Typing effect for the initial terminal block
    const initCmd = document.getElementById('init-cmd');
    const initCursor = document.getElementById('init-cursor');
    const initOutput = document.getElementById('init-output');
    const termActive = document.getElementById('term-active');
    
    const commandText = "whoami";
    let charIdx = 0;

    function typeCommand() {
        if (charIdx < commandText.length) {
            initCmd.textContent += commandText.charAt(charIdx);
            charIdx++;
            setTimeout(typeCommand, 200); // Slower typing
        } else {
            initCursor.style.display = 'none';
            initOutput.style.display = 'block';
            
            // Show line by line slowly
            const lines = initOutput.querySelectorAll('p, br');
            lines.forEach(l => l.style.opacity = '0');
            
            let lineIdx = 0;
            function showLine() {
                if (lineIdx < lines.length) {
                    lines[lineIdx].style.opacity = '1';
                    lines[lineIdx].style.transition = 'opacity 0.4s ease-in';
                    lineIdx++;
                    setTimeout(showLine, 400); // 400ms delay between lines
                } else {
                    setTimeout(() => {
                        termActive.style.display = 'block';
                        setupInteractiveTerminal();
                    }, 500);
                }
            }
            showLine();
        }
    }

    // Start typing effect after a longer delay to give user time to see terminal
    setTimeout(typeCommand, 1500);

    // Interactive commands logic
    const termContent = document.getElementById('term-content');
    const activeCmd = document.getElementById('active-cmd');
    const activeCursor = document.getElementById('active-cursor');

    function setupInteractiveTerminal() {
        let isInsertMode = false;
        let currentInput = "";
        let commandHistory = [];
        let historyIndex = -1;
        
        // Commands list for autocomplete
        const availableCommands = ['whoami', 'skills', 'clear', 'help'];
        
        // Cursor CSS management for vi mode (Normal mode default)
        activeCursor.style.animation = 'none';
        activeCursor.style.opacity = '1'; // Solid block

        // Adding an insert mode indicator
        const modeIndicator = document.createElement('div');
        modeIndicator.style.position = 'absolute';
        modeIndicator.style.bottom = '10px';
        modeIndicator.style.right = '15px';
        modeIndicator.style.color = '#5c6370';
        modeIndicator.style.fontSize = '0.8rem';
        modeIndicator.textContent = '-- NORMAL -- (Press i or Enter to type)';
        
        const terminalBlock = document.querySelector('.terminal-block');
        terminalBlock.style.position = 'relative';
        terminalBlock.appendChild(modeIndicator);

        document.addEventListener('keydown', (e) => {
            // Ignore if modifier keys are pressed
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            
            if (!isInsertMode) {
                if (e.key === 'i' || e.key === 'Enter') {
                    isInsertMode = true;
                    activeCursor.style.animation = 'cursor-blink 1s step-end infinite';
                    modeIndicator.textContent = '-- INSERT -- (Press Esc to exit)';
                    modeIndicator.style.color = '#98c379'; // Green
                    e.preventDefault();
                }
                return; // Let other keys do normal page actions (scrolling)
            }

            // --- In Insert Mode ---
            if (e.key === 'Escape') {
                isInsertMode = false;
                activeCursor.style.animation = 'none';
                activeCursor.style.opacity = '1';
                modeIndicator.textContent = '-- NORMAL -- (Press i or Enter to type)';
                modeIndicator.style.color = '#5c6370';
                e.preventDefault();
                return;
            }

            // Prevent default page scrolling when pressing space or arrows in insert mode
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
                return;
            }

            if (e.key === 'Backspace') {
                currentInput = currentInput.slice(0, -1);
                activeCmd.textContent = currentInput;
                return;
            }

            if (e.key === 'Tab') {
                // Autocomplete
                const matches = availableCommands.filter(c => c.startsWith(currentInput.toLowerCase()));
                if (matches.length === 1) {
                    currentInput = matches[0];
                    activeCmd.textContent = currentInput;
                }
                return;
            }

            if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    currentInput = commandHistory[historyIndex];
                    activeCmd.textContent = currentInput;
                }
                return;
            }

            if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    currentInput = commandHistory[historyIndex];
                    activeCmd.textContent = currentInput;
                } else {
                    historyIndex = commandHistory.length;
                    currentInput = '';
                    activeCmd.textContent = '';
                }
                return;
            }

            // Printable characters
            if (e.key.length === 1) {
                currentInput += e.key;
                activeCmd.textContent = currentInput;
            }
        });
    }

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
            outputBlock.innerHTML = \`<p>Command not recognized. Type "help" to see available commands.</p>\`;
        }

        termContent.appendChild(outputBlock);
    }

    // Keep the clickable commands working for mouse users
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-cmd')) {
            const cmd = e.target.getAttribute('data-cmd');
            // If user clicks, simulate enter in normal flow
            executeCommand(cmd);
        }
    });

    // Intersection Observer for fade-in cards
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
