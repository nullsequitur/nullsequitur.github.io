import { Store } from './store.js';

export const settingsOptions = ['theme', 'crt', 'cursor', 'fontsize'];

let savedTerminalHTML = '';
let terminalContentElement = null;
export let currentMenuIndex = 0;

export function initSettings(termContent, savedHTML) {
    terminalContentElement = termContent;
    savedTerminalHTML = savedHTML;
    currentMenuIndex = 0;
    
    Store.initSettings();
    
    renderMenu();
}

function renderMenu() {
    if (!terminalContentElement) return;

    let html = `<div class="tui-container">
       <div class="tui-header">--- Settings ---</div>`;
    
    const themeText = Store.currentTheme === 'mocha' ? 'Catppuccin Mocha' : 'Catppuccin Latte';
    html += `<div class="tui-row ${currentMenuIndex === 0 ? 'active' : ''}">${currentMenuIndex === 0 ? '> ' : '  '}Theme: ${themeText}</div>`;
    
    const crtModes = {'off': 'Off', 'subtle': 'Subtle', 'hard': 'Hard'};
    const crtText = crtModes[Store.crtMode] || 'Subtle';
    html += `<div class="tui-row ${currentMenuIndex === 1 ? 'active' : ''}">${currentMenuIndex === 1 ? '> ' : '  '}CRT Scanlines: ${crtText}</div>`;
    
    html += `<div class="tui-row ${currentMenuIndex === 2 ? 'active' : ''}">${currentMenuIndex === 2 ? '> ' : '  '}Blinking Cursor: ${Store.cursorBlinkEnabled ? 'On' : 'Off'}</div>`;
    
    const fontSizes = {'14px': 'Small', '16px': 'Medium', '18px': 'Large'};
    const fontText = fontSizes[Store.currentFontSize] || 'Medium';
    html += `<div class="tui-row ${currentMenuIndex === 3 ? 'active' : ''}">${currentMenuIndex === 3 ? '> ' : '  '}Font Size: ${fontText}</div>`;

    html += `<div class="tui-footer" style="margin-top: 1em;">[Up/Down] Navigate  [Enter/Space] Toggle  [Q/Esc] Exit</div>
     </div>`;

    terminalContentElement.innerHTML = html;
}

export function handleSettingsKeydown(e, exitTuiCallback) {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentMenuIndex = (currentMenuIndex - 1 + settingsOptions.length) % settingsOptions.length;
        renderMenu();
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentMenuIndex = (currentMenuIndex + 1) % settingsOptions.length;
        renderMenu();
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSetting(currentMenuIndex);
        renderMenu();
    } else if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        e.preventDefault();
        exitTuiCallback(savedTerminalHTML);
    }
}

function toggleSetting(index) {
    const opt = settingsOptions[index];
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
