import { availableCommands } from './commands.js';

describe('Terminal Commands', () => {
    test('availableCommands list is correct', () => {
        expect(availableCommands).toContain('whoami');
        expect(availableCommands).toContain('skills');
        expect(availableCommands).toContain('clear');
        expect(availableCommands).toContain('help');
        expect(availableCommands.length).toBe(4);
    });
});
