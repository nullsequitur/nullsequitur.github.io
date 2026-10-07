export const Store = {
    // Filesystem State
    currentDirectory: '~',

    // Terminal State
    terminalMode: 'command',
    commandHistory: [],
    
    // UI Settings State
    currentTheme: 'mocha',
    crtMode: 'subtle',
    cursorBlinkEnabled: true,
    currentFontSize: '16px',
    
    // Initialize settings from DOM/LocalStorage
    initSettings() {
        this.currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'mocha';
        this.crtMode = document.body.getAttribute('data-crt') || 'subtle';
        this.cursorBlinkEnabled = localStorage.getItem('cursorBlink') !== 'off';
        this.currentFontSize = localStorage.getItem('fontSize') || '16px';
    },

    // Optional: add a reset method for testing
    reset() {
        this.currentDirectory = '~';
        this.terminalMode = 'command';
        this.commandHistory = [];
        this.currentTheme = 'mocha';
        this.crtMode = 'subtle';
        this.cursorBlinkEnabled = true;
        this.currentFontSize = '16px';
    }
};
