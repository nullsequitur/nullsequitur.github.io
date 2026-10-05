import { siteData } from './content.js';
import * as fs from './filesystem.js';
import { setTerminalMode } from './terminal.js';
import { initSettings } from './settings-tui.js';

export const availableCommands = ['whoami', 'skills', 'clear', 'help', 'ls', 'cd', 'cat', 'pwd', 'contact', 'settings', 'fetch'];

function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export const commandRegistry = {
    fetch: {
        description: "Fetch system information",
        execute: (args, termContent, outputBlock) => {
            const fetchDiv = document.createElement('div');
            fetchDiv.style.display = 'flex';
            fetchDiv.style.gap = '2rem';
            fetchDiv.style.alignItems = 'center';
            fetchDiv.style.marginBottom = '1rem';

            const leftCol = document.createElement('pre');
            leftCol.style.color = 'var(--color-primary)';
            leftCol.style.margin = '0';
            leftCol.style.lineHeight = '1.2';
            
            const rightCol = document.createElement('div');
            const user = siteData?.user || {};
            
            fetchDiv.appendChild(leftCol);
            fetchDiv.appendChild(rightCol);
            outputBlock.appendChild(fetchDiv);

            const asciiLines = [
                "",
                "      /\\",
                "     /  \\",
                "    /  / \\",
                "   /  /   \\",
                "  |  /     |",
                "  | /      |",
                "   \\      /",
                "    \\____/",
                ""
            ];

            const infoLines = [
                `<p><span class="key">User:</span> ${escapeHTML(user.name || 'Unknown')}</p>`,
                `<p><span class="key">Role:</span> ${escapeHTML(user.role || 'Unknown')}</p>`,
                `<p><span class="key">Focus:</span> ${escapeHTML(user.focus || 'Unknown')}</p>`,
                `<p><span class="key">OS:</span> Arch Linux</p>`,
                `<p><span class="key">Shell:</span> zsh</p>`
            ];

            const maxLines = Math.max(asciiLines.length, infoLines.length);
            let currentLine = 0;

            const intervalId = setInterval(() => {
                if (currentLine < maxLines) {
                    if (currentLine < asciiLines.length) {
                        leftCol.textContent += (currentLine === 0 ? "" : "\n") + asciiLines[currentLine];
                    } else {
                        leftCol.textContent += "\n";
                    }
                    
                    if (currentLine < infoLines.length) {
                        rightCol.innerHTML += infoLines[currentLine];
                    }
                    
                    if (termContent.parentElement) {
                        termContent.parentElement.scrollTop = termContent.parentElement.scrollHeight;
                    }
                    currentLine++;
                } else {
                    clearInterval(intervalId);
                    const hint = document.createElement('p');
                    hint.style.color = 'gray';
                    hint.textContent = "Type 'help' to see available commands.";
                    outputBlock.appendChild(hint);
                    if (termContent.parentElement) {
                        termContent.parentElement.scrollTop = termContent.parentElement.scrollHeight;
                    }
                }
            }, 50);
        }
    },
    settings: {
        description: "Open interactive settings menu",
        execute: (args, termContent, outputBlock) => {
            const savedHTML = termContent.innerHTML;
            setTerminalMode('tui');
            document.getElementById('term-active').style.display = 'none';
            initSettings(termContent, savedHTML);
        }
    },
    whoami: {
        description: "Display user info",
        execute: (args, termContent, outputBlock) => {
            if (!siteData?.user) return;
            const nameDiv = document.createElement('p');
            nameDiv.innerHTML = `<span class="key">name:</span> <span class="glow-text">${escapeHTML(siteData.user.name)}</span>`;
            const roleDiv = document.createElement('p');
            roleDiv.innerHTML = `<span class="key">role:</span> ${escapeHTML(siteData.user.role)}`;
            const focusDiv = document.createElement('p');
            focusDiv.innerHTML = `<span class="key">focus:</span> ${escapeHTML(siteData.user.focus)}`;
            
            outputBlock.appendChild(nameDiv);
            outputBlock.appendChild(roleDiv);
            outputBlock.appendChild(focusDiv);
        }
    },
    skills: {
        description: "List technical skills",
        execute: (args, termContent, outputBlock) => {
            if (!siteData?.skills) return;
            const langsDiv = document.createElement('p');
            langsDiv.innerHTML = `<span class="key">languages:</span> ${escapeHTML((siteData.skills.languages || []).join(', '))}`;
            const toolsDiv = document.createElement('p');
            toolsDiv.innerHTML = `<span class="key">tools:</span> ${escapeHTML((siteData.skills.tools || []).join(', '))}`;
            const osDiv = document.createElement('p');
            osDiv.innerHTML = `<span class="key">os:</span> ${escapeHTML((siteData.skills.os || []).join(', '))}`;
            
            outputBlock.appendChild(langsDiv);
            outputBlock.appendChild(toolsDiv);
            outputBlock.appendChild(osDiv);
        }
    },
    clear: {
        description: "Clear terminal",
        execute: (args, termContent) => {
            termContent.innerHTML = '';
        }
    },
    help: {
        description: "Show available commands",
        execute: (args, termContent, outputBlock) => {
            const helpContent = document.createElement('div');
            let content = '<p>Available commands:</p><ul>';
            availableCommands.forEach(cmd => {
                const desc = commandRegistry[cmd]?.description || '';
                content += `<li><span class="glow-text">${escapeHTML(cmd)}</span> - ${escapeHTML(desc)}</li>`;
            });
            content += '</ul>';
            helpContent.innerHTML = content;
            outputBlock.appendChild(helpContent);
        }
    },
    ls: {
        description: "List directory contents",
        execute: (args, termContent, outputBlock) => {
            const path = args[0] || fs.getCurrentDirectory();
            try {
                const items = fs.listDirectory(path);
                const p = document.createElement('p');
                items.forEach(item => {
                    const fullPath = (path.endsWith('/') ? path : path + '/') + item;
                    const isDir = fs.isDirectory(fullPath);
                    const span = document.createElement('span');
                    span.textContent = item + (isDir ? '/' : '') + ' ';
                    span.className = isDir ? 'dir-name' : 'file-name';
                    p.appendChild(span);
                });
                outputBlock.appendChild(p);
            } catch (e) {
                const p = document.createElement('p');
                p.textContent = `ls: cannot access '${args[0]}': No such file or directory`;
                outputBlock.appendChild(p);
            }
        }
    },
    cd: {
        description: "Change directory",
        execute: (args, termContent, outputBlock) => {
            const path = args[0] || '/';
            try {
                fs.setCurrentDirectory(path);
                document.dispatchEvent(new CustomEvent('cd', { detail: path }));
            } catch (e) {
                const p = document.createElement('p');
                if (fs.isFile(path)) {
                    p.innerHTML = `cd: ${escapeHTML(path)}: Not a directory<br><span class="cmd-hint">Hint: did you mean '<span class="clickable-cmd" data-cmd="cat ${escapeHTML(path)}">cat ${escapeHTML(path)}</span>'?</span>`;
                } else {
                    p.textContent = e.message || `cd: ${path}: No such file or directory`;
                }
                outputBlock.appendChild(p);
            }
        }
    },
    cat: {
        description: "View file contents",
        execute: (args, termContent, outputBlock) => {
            if (!args[0]) {
                const p = document.createElement('p');
                p.textContent = `cat: missing operand`;
                outputBlock.appendChild(p);
                return;
            }
            const path = args[0];
            if (!fs.isFile(path)) {
                const p = document.createElement('p');
                p.textContent = `cat: ${path}: No such file or directory`;
                outputBlock.appendChild(p);
                return;
            }
            const node = fs.getNode(path);
            if (node) {
                const p = document.createElement('p');
                p.innerHTML = `${escapeHTML(node.synopsis || '')}<br><a href="${escapeHTML(node.url || '')}" target="_blank">${escapeHTML(node.url || '')}</a>`;
                outputBlock.appendChild(p);
            }
        }
    },
    pwd: {
        description: "Print working directory",
        execute: (args, termContent, outputBlock) => {
            const p = document.createElement('p');
            p.textContent = fs.getCurrentDirectory();
            outputBlock.appendChild(p);
        }
    },
    contact: {
        description: "Show contact information",
        execute: (args, termContent, outputBlock) => {
            if (!siteData?.user) return;
            const emailDiv = document.createElement('p');
            emailDiv.innerHTML = `<span class="key">email:</span> ${escapeHTML(siteData.user.email || '')}`;
            const githubDiv = document.createElement('p');
            githubDiv.innerHTML = `<span class="key">github:</span> <a href="${escapeHTML(siteData.user.github || '')}" target="_blank">${escapeHTML(siteData.user.github || '')}</a>`;
            const linkedinDiv = document.createElement('p');
            linkedinDiv.innerHTML = `<span class="key">linkedin:</span> <a href="${escapeHTML(siteData.user.linkedin || '')}" target="_blank">${escapeHTML(siteData.user.linkedin || '')}</a>`;
            
            outputBlock.appendChild(emailDiv);
            outputBlock.appendChild(githubDiv);
            outputBlock.appendChild(linkedinDiv);
        }
    }
};

export function printPromptLine(rawCmd, termContent) {
    let newBlock = document.createElement('div');
    const currentPath = fs.getCurrentDirectory();
    const pathStr = currentPath === '/' ? '~' : '~' + currentPath;
    newBlock.innerHTML = `<div class="term-line prompt-path">${pathStr}</div>
                          <div class="term-line"><span class="prompt"><span class="pastel-blue">∅</span><span class="pastel-grey">＞</span> </span> <span class="command"></span></div>`;
    newBlock.querySelector('.command').textContent = rawCmd;
    termContent.appendChild(newBlock);
    if (termContent.parentElement) {
        termContent.parentElement.scrollTop = termContent.parentElement.scrollHeight;
    }
}

export function printMessageAndPrompt(messageStr, currentInput, termContent) {
    printPromptLine(currentInput, termContent);
    if (messageStr) {
        let outputBlock = document.createElement('div');
        outputBlock.className = 'cmd-output';
        const p = document.createElement('p');
        p.style.whiteSpace = 'pre-wrap';
        p.textContent = messageStr;
        outputBlock.appendChild(p);
        termContent.appendChild(outputBlock);
        if (termContent.parentElement) {
            termContent.parentElement.scrollTop = termContent.parentElement.scrollHeight;
        }
    }
}

export function executeCommand(rawCmd, termContent) {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
        // empty command, just print prompt
        printPromptLine('', termContent);
        return;
    }
    
    const tokens = trimmed.split(/\s+/);
    const cmdName = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    if (cmdName === 'clear') {
        commandRegistry.clear.execute(args, termContent);
        return;
    }

    printPromptLine(rawCmd, termContent);

    let outputBlock = document.createElement('div');
    outputBlock.className = 'cmd-output';

    if (commandRegistry[cmdName]) {
        commandRegistry[cmdName].execute(args, termContent, outputBlock);
    } else {
        const p = document.createElement('p');
        p.textContent = `Command not recognized: ${cmdName}. Type "help" to see available commands.`;
        outputBlock.appendChild(p);
    }

    if (outputBlock.hasChildNodes()) {
        termContent.appendChild(outputBlock);
        if (termContent.parentElement) {
            termContent.parentElement.scrollTop = termContent.parentElement.scrollHeight;
        }
    }
}
