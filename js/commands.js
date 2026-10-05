export const availableCommands = ['whoami', 'skills', 'clear', 'help'];

export function executeCommand(cmd, termContent) {
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
