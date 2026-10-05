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
            setTimeout(typeCommand, 150);
        } else {
            initCursor.style.display = 'none';
            initOutput.style.display = 'block';
            setTimeout(() => {
                termActive.style.display = 'block';
            }, 500);
        }
    }

    // Start typing effect after a short delay
    setTimeout(typeCommand, 800);

    // Clickable commands logic
    const termContent = document.getElementById('term-content');
    const activeCmd = document.getElementById('active-cmd');

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-cmd')) {
            const cmd = e.target.getAttribute('data-cmd');
            executeCommand(cmd);
        }
    });

    function executeCommand(cmd) {
        // Disable click while animating
        termActive.style.display = 'none';
        activeCmd.textContent = "";
        
        let newBlock = document.createElement('div');
        newBlock.innerHTML = `<div class="term-line"><span class="prompt"><span class="pastel-blue">∅</span><span class="pastel-grey">＞</span> </span> <span class="command">${cmd}</span></div>`;
        termContent.appendChild(newBlock);

        let outputBlock = document.createElement('div');
        outputBlock.className = 'cmd-output';
        
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
        } else if (cmd === 'clear') {
            termContent.innerHTML = '';
            outputBlock = null;
        }

        if (outputBlock) {
            termContent.appendChild(outputBlock);
        }

        // Show prompt again
        termActive.style.display = 'block';
    }

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
