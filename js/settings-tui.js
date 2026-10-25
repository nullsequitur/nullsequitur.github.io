import { Store } from './store.js';

export const settingsOptions = ['theme', 'crt', 'cursor', 'fontsize', 'return'];

let savedTerminalHTML = '';
let terminalContentElement = null;
let currentExitCallback = null;
export let currentMenuIndex = 0;

export function exitSettings() {
    if (currentExitCallback) {
        currentExitCallback(savedTerminalHTML);
    } else {
        if (terminalContentElement) {
            terminalContentElement.innerHTML = savedTerminalHTML;
        }
        const termActive = document.getElementById('term-active');
        if (termActive) termActive.style.display = 'block';
        const terminalBody = document.getElementById('term-body');
        if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
        Store.terminalMode = 'command';
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) setTimeout(() => terminalInput.focus(), 10);
    }
}

export function initSettings(termContent, savedHTML, onExit) {
    terminalContentElement = termContent;
    savedTerminalHTML = savedHTML;
    currentMenuIndex = 0;
    currentExitCallback = onExit || null;
    
    // Blur terminal input to avoid popping up mobile keyboard while in settings TUI
    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput) {
        terminalInput.blur();
    }

    Store.initSettings();
    
    renderMenu();
}

export function renderMenu() {
    if (!terminalContentElement) return;

    let html = `<div class="tui-container">
       <div class="tui-header">--- Settings ---</div>`;
    
    const themeText = Store.currentTheme === 'mocha' ? 'Catppuccin Mocha' : 'Catppuccin Latte';
    html += `<div class="tui-row ${currentMenuIndex === 0 ? 'active' : ''}" data-index="0">${currentMenuIndex === 0 ? '> ' : '  '}Theme: ${themeText}</div>`;
    
    const crtModes = {'off': 'Off', 'subtle': 'Subtle', 'hard': 'Hard'};
    const crtText = crtModes[Store.crtMode] || 'Subtle';
    html += `<div class="tui-row ${currentMenuIndex === 1 ? 'active' : ''}" data-index="1">${currentMenuIndex === 1 ? '> ' : '  '}CRT Scanlines: ${crtText}</div>`;
    
    html += `<div class="tui-row ${currentMenuIndex === 2 ? 'active' : ''}" data-index="2">${currentMenuIndex === 2 ? '> ' : '  '}Blinking Cursor: ${Store.cursorBlinkEnabled ? 'On' : 'Off'}</div>`;
    
    const fontSizes = {'14px': 'Small', '16px': 'Medium', '18px': 'Large'};
    const fontText = fontSizes[Store.currentFontSize] || 'Medium';
    html += `<div class="tui-row ${currentMenuIndex === 3 ? 'active' : ''}" data-index="3">${currentMenuIndex === 3 ? '> ' : '  '}Font Size: ${fontText}</div>`;

    html += `<div class="tui-row ${currentMenuIndex === 4 ? 'active' : ''}" data-index="4">${currentMenuIndex === 4 ? '> ' : '  '}Return</div>`;

    html += `<div class="tui-footer" style="margin-top: 1em;">[↑/↓ or j/k or Tap] Navigate  [Enter/Space/Tap] Toggle  [Q/Esc] Exit</div>
     </div>`;

    terminalContentElement.innerHTML = html;

    const container = terminalContentElement.querySelector('.tui-container');
    if (container) {
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            const row = e.target.closest('.tui-row');
            if (!row) return;
            const index = parseInt(row.getAttribute('data-index'), 10);
            if (!isNaN(index) && index >= 0 && index < settingsOptions.length) {
                currentMenuIndex = index;
                toggleSetting(index);
                if (settingsOptions[index] !== 'return') {
                    renderMenu();
                }
            }
        });
    }
}

export function handleSettingsKeydown(e, exitTuiCallback) {
    if (exitTuiCallback) {
        currentExitCallback = exitTuiCallback;
    }
    if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        currentMenuIndex = (currentMenuIndex - 1 + settingsOptions.length) % settingsOptions.length;
        renderMenu();
    } else if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        currentMenuIndex = (currentMenuIndex + 1) % settingsOptions.length;
        renderMenu();
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSetting(currentMenuIndex);
        if (settingsOptions[currentMenuIndex] !== 'return') {
            renderMenu();
        }
    } else if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        e.preventDefault();
        exitSettings();
    }
}

export function toggleSetting(index) {
    const opt = settingsOptions[index];
    if (opt === 'return') {
        exitSettings();
        return;
    }
    if (opt === 'theme') {
        const themes = ['mocha', 'latte'];
        let idx = themes.indexOf(Store.currentTheme);
        Store.currentTheme = themes[(idx + 1) % themes.length];
        document.documentElement.setAttribute('data-theme', Store.currentTheme);
        localStorage.setItem('theme', Store.currentTheme);
    } else if (opt === 'crt') {
        if (Store.crtMode === 'hard') Store.crtMode = 'off';
        else if (Store.crtMode === 'off') Store.crtMode = 'subtle';
        else Store.crtMode = 'hard';
        document.body.setAttribute('data-crt', Store.crtMode);
        localStorage.setItem('crtMode', Store.crtMode);
    } else if (opt === 'cursor') {
        Store.cursorBlinkEnabled = !Store.cursorBlinkEnabled;
        if (Store.cursorBlinkEnabled) {
            document.body.classList.remove('disable-cursor-blink');
        } else {
            document.body.classList.add('disable-cursor-blink');
        }
        localStorage.setItem('cursorBlink', Store.cursorBlinkEnabled ? 'on' : 'off');
    } else if (opt === 'fontsize') {
        if (Store.currentFontSize === '14px') Store.currentFontSize = '16px';
        else if (Store.currentFontSize === '16px') Store.currentFontSize = '18px';
        else Store.currentFontSize = '14px';
        document.body.style.setProperty('--term-font-size', Store.currentFontSize);
        localStorage.setItem('fontSize', Store.currentFontSize);
    }
}
