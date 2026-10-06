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
        expect(resolvePath('/physics', '/linux')).toBe('/linux');
        expect(resolvePath('/physics', '/')).toBe('/');
    });

    test('resolvePath resolves relative paths', () => {
        expect(resolvePath('/', 'physics')).toBe('/physics');
        expect(resolvePath('/physics', 'publications')).toBe('/physics/publications');
    });

    test('resolvePath handles . and ..', () => {
        expect(resolvePath('/physics', '..')).toBe('/');
        expect(resolvePath('/physics/publications', '..')).toBe('/physics');
        expect(resolvePath('/physics', '.')).toBe('/physics');
        expect(resolvePath('/', '..')).toBe('/');
        expect(resolvePath('/physics/smeftFR', '../../linux')).toBe('/linux');
    });

    test('getNode returns root node', () => {
        const node = getNode('/');
        expect(node).toBeDefined();
        expect(node.type).toBe('directory');
        expect(node.children).toBeDefined();
    });

    test('getNode returns existing node', () => {
        const node = getNode('/physics');
        expect(node).toBeDefined();
        expect(node.type).toBe('directory');
        
        const fileNode = getNode('/physics/smeftFR');
        expect(fileNode).toBeDefined();
        expect(fileNode.type).toBe('file');
    });

    test('getNode returns null for non-existing node', () => {
        expect(getNode('/nonexistent')).toBeNull();
        expect(getNode('/physics/nonexistent')).toBeNull();
    });

    test('isDirectory and isFile work correctly', () => {
        expect(isDirectory('/')).toBe(true);
        expect(isDirectory('/physics')).toBe(true);
        expect(isFile('/physics')).toBe(false);
        
        expect(isFile('/physics/smeftFR')).toBe(true);
        expect(isDirectory('/physics/smeftFR')).toBe(false);
        
        expect(isDirectory('/nonexistent')).toBe(false);
        expect(isFile('/nonexistent')).toBe(false);
    });

    test('listDirectory lists contents of a directory', () => {
        const contents = listDirectory('/');
        expect(contents).toContain('physics');
        expect(contents).toContain('projects');
        
        const physicsContents = listDirectory('/physics');
        expect(physicsContents).toContain('smeftFR');
        expect(physicsContents).toContain('publications');
    });

    test('listDirectory throws on file or nonexistent path', () => {
        expect(() => listDirectory('/physics/smeftFR')).toThrow();
        expect(() => listDirectory('/nonexistent')).toThrow();
    });

    test('setCurrentDirectory updates current dir', () => {
        expect(setCurrentDirectory('/physics')).toBe(true);
        expect(getCurrentDirectory()).toBe('/physics');
        
        expect(setCurrentDirectory('..')).toBe(true);
        expect(getCurrentDirectory()).toBe('/');
    });

    test('setCurrentDirectory throws on file or nonexistent path', () => {
        expect(() => setCurrentDirectory('/physics/smeftFR')).toThrow();
        expect(() => setCurrentDirectory('/nonexistent')).toThrow();
    });

    test('getCompletions returns matches', () => {
        const matches = getCompletions('/', 'ph');
        expect(matches).toEqual(['physics']);
        
        const matches2 = getCompletions('/', 'p');
        expect(matches2).toEqual(['physics', 'projects']);
        
        setCurrentDirectory('/physics');
        const matches3 = getCompletions('/physics', 'p');
        expect(matches3).toEqual(['publications']);
    });
    
    test('getCompletions with path prefix', () => {
        const matches = getCompletions('/', 'physics/p');
        expect(matches).toEqual(['physics/publications']);
    });
});
