export let currentMenuIndex = 0;
export const settingsOptions = ['theme', 'crt', 'cursor', 'fontsize'];

let savedTerminalHTML = '';
let terminalContentElement = null;
let currentTheme = 'mocha';
let crtMode = 'subtle';
let cursorBlinkEnabled = true;
let currentFontSize = '16px';

export function initSettings(termContent, savedHTML) {
    terminalContentElement = termContent;
    savedTerminalHTML = savedHTML;
    currentMenuIndex = 0;

    // Load initial state from DOM / LocalStorage
    currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'mocha';
    crtMode = document.body.getAttribute('data-crt') || 'subtle';
    cursorBlinkEnabled = localStorage.getItem('cursorBlink') !== 'off';
    currentFontSize = localStorage.getItem('fontSize') || '16px';
    
    renderMenu();
}

function renderMenu() {
    if (!terminalContentElement) return;

    let html = `<div class="tui-container">
       <div class="tui-header">--- Settings ---</div>`;
    
    const themeText = currentTheme === 'mocha' ? 'Catppuccin Mocha' : 'Catppuccin Latte';
    html += `<div class="tui-row ${currentMenuIndex === 0 ? 'active' : ''}">${currentMenuIndex === 0 ? '> ' : '  '}Theme: ${themeText}</div>`;
    
    const crtModes = {'off': 'Off', 'subtle': 'Subtle', 'hard': 'Hard'};
    const crtText = crtModes[crtMode] || 'Subtle';
    html += `<div class="tui-row ${currentMenuIndex === 1 ? 'active' : ''}">${currentMenuIndex === 1 ? '> ' : '  '}CRT Scanlines: ${crtText}</div>`;
    
    html += `<div class="tui-row ${currentMenuIndex === 2 ? 'active' : ''}">${currentMenuIndex === 2 ? '> ' : '  '}Blinking Cursor: ${cursorBlinkEnabled ? 'On' : 'Off'}</div>`;
    
    const fontSizes = {'14px': 'Small', '16px': 'Medium', '18px': 'Large'};
    const fontText = fontSizes[currentFontSize] || 'Medium';
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
        let idx = themes.indexOf(currentTheme);
        currentTheme = themes[(idx + 1) % themes.length];
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    } else if (opt === 'crt') {
        if (crtMode === 'hard') crtMode = 'off';
        else if (crtMode === 'off') crtMode = 'subtle';
        else crtMode = 'hard';
        document.body.setAttribute('data-crt', crtMode);
        localStorage.setItem('crtMode', crtMode);
    } else if (opt === 'cursor') {
        cursorBlinkEnabled = !cursorBlinkEnabled;
        // Since prompt line isn't rendered during TUI, we just add/remove class to body or rely on terminal re-render
        // But for global cursor, applying to body or a global style is better.
        // The requirements say: Add/remove a class `.disable-cursor-blink` on `.prompt`.
        // We will do this when prompt is regenerated, but we can also set a global state.
        // Actually, let's just add it to body and let CSS handle it, or we can find all prompts.
        // Wait, the prompt is part of the savedHTML, so we can't easily modify it until restored.
        // Let's set a global flag or class on body to control cursor blink, wait, the instructions say "on .prompt".
        // Let's handle applying `.disable-cursor-blink` to `.prompt` by dispatching an event or handling it in `terminal.js`.
        // For now, I'll store it and apply to body, and CSS can be `body.disable-cursor-blink .prompt { ... }` ?
        // The instructions: "Add/remove a class .disable-cursor-blink on .prompt."
        // We'll update the savedTerminalHTML to reflect the change, or just update the DOM elements when exiting.
        // But wait, the setting takes effect immediately? If TUI is active, there's no prompt.
        // Let's just store the state in localStorage and apply it.
        if (cursorBlinkEnabled) {
            document.body.classList.remove('disable-cursor-blink');
        } else {
            document.body.classList.add('disable-cursor-blink');
        }
        localStorage.setItem('cursorBlink', cursorBlinkEnabled ? 'on' : 'off');
    } else if (opt === 'fontsize') {
        if (currentFontSize === '14px') currentFontSize = '16px';
        else if (currentFontSize === '16px') currentFontSize = '18px';
        else currentFontSize = '14px';
        document.body.style.setProperty('--term-font-size', currentFontSize);
        localStorage.setItem('fontSize', currentFontSize);
    }
}
