import {
    resolvePath,
    getNode,
    isDirectory,
    isFile,
    listDirectory,
    getCompletions,
    getCurrentDirectory,
    setCurrentDirectory,
} from './filesystem.js';

describe('Virtual Filesystem', () => {
    beforeEach(() => {
        // Reset current directory before each test
        setCurrentDirectory('/');
    });

    test('getCurrentDirectory returns initial path', () => {
        expect(getCurrentDirectory()).toBe('/');
    });

    test('resolvePath resolves absolute paths', () => {
        expect(resolvePath('/research', '/linux')).toBe('/linux');
        expect(resolvePath('/research', '/')).toBe('/');
    });

    test('resolvePath resolves relative paths', () => {
        expect(resolvePath('/', 'research')).toBe('/research');
        expect(resolvePath('/research', 'papers')).toBe('/research/papers');
    });

    test('resolvePath handles . and ..', () => {
        expect(resolvePath('/research', '..')).toBe('/');
        expect(resolvePath('/research/papers', '..')).toBe('/research');
        expect(resolvePath('/research', '.')).toBe('/research');
        expect(resolvePath('/', '..')).toBe('/');
        expect(resolvePath('/research/smeftFR', '../../linux')).toBe('/linux');
    });

    test('getNode returns root node', () => {
        const node = getNode('/');
        expect(node).toBeDefined();
        expect(node.type).toBe('directory');
        expect(node.children).toBeDefined();
    });

    test('getNode returns existing node', () => {
        const node = getNode('/research');
        expect(node).toBeDefined();
        expect(node.type).toBe('directory');
        
        const fileNode = getNode('/research/smeftFR');
        expect(fileNode).toBeDefined();
        expect(fileNode.type).toBe('file');
    });

    test('getNode returns null for non-existing node', () => {
        expect(getNode('/nonexistent')).toBeNull();
        expect(getNode('/research/nonexistent')).toBeNull();
    });

    test('isDirectory and isFile work correctly', () => {
        expect(isDirectory('/')).toBe(true);
        expect(isDirectory('/research')).toBe(true);
        expect(isFile('/research')).toBe(false);
        
        expect(isFile('/research/smeftFR')).toBe(true);
        expect(isDirectory('/research/smeftFR')).toBe(false);
        
        expect(isDirectory('/nonexistent')).toBe(false);
        expect(isFile('/nonexistent')).toBe(false);
    });

    test('listDirectory lists contents of a directory', () => {
        const contents = listDirectory('/');
        expect(contents).toContain('research');
        expect(contents).toContain('linux');
        
        const researchContents = listDirectory('/research');
        expect(researchContents).toContain('smeftFR');
        expect(researchContents).toContain('papers');
    });

    test('listDirectory throws on file or nonexistent path', () => {
        expect(() => listDirectory('/research/smeftFR')).toThrow();
        expect(() => listDirectory('/nonexistent')).toThrow();
    });

    test('setCurrentDirectory updates current dir', () => {
        expect(setCurrentDirectory('/research')).toBe(true);
        expect(getCurrentDirectory()).toBe('/research');
        
        expect(setCurrentDirectory('..')).toBe(true);
        expect(getCurrentDirectory()).toBe('/');
    });

    test('setCurrentDirectory throws on file or nonexistent path', () => {
        expect(() => setCurrentDirectory('/research/smeftFR')).toThrow();
        expect(() => setCurrentDirectory('/nonexistent')).toThrow();
    });

    test('getCompletions returns matches', () => {
        const matches = getCompletions('/', 're');
        expect(matches).toEqual(['research']);
        
        const matches2 = getCompletions('/', 'l');
        expect(matches2).toEqual(['linux']);
        
        setCurrentDirectory('/research');
        const matches3 = getCompletions('/research', 'p');
        expect(matches3).toEqual(['papers']);
    });
    
    test('getCompletions with path prefix', () => {
        const matches = getCompletions('/', 'research/p');
        expect(matches).toEqual(['papers']);
    });
});
