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
        setCurrentDirectory('~');
    });

    test('getCurrentDirectory returns initial path', () => {
        expect(getCurrentDirectory()).toBe('~');
    });

    test('resolvePath resolves absolute paths', () => {
        expect(resolvePath('~/academic', '~/sys_infra')).toBe('~/sys_infra');
        expect(resolvePath('~/academic', '~')).toBe('~');
    });

    test('resolvePath resolves relative paths', () => {
        expect(resolvePath('~', 'academic')).toBe('~/academic');
        expect(resolvePath('~/academic', 'phd')).toBe('~/academic/phd');
    });

    test('resolvePath handles . and ..', () => {
        expect(resolvePath('~/academic', '..')).toBe('~');
        expect(resolvePath('~/academic/phd', '..')).toBe('~/academic');
        expect(resolvePath('~/academic', '.')).toBe('~/academic');
        expect(resolvePath('~', '..')).toBe('~');
        expect(resolvePath('~/academic/phd', '../../sys_infra')).toBe('~/sys_infra');
    });

    test('getNode returns root node', () => {
        const node = getNode('~');
        expect(node).toBeDefined();
        expect(node.type).toBe('directory');
        expect(node.children).toBeDefined();
    });

    test('getNode returns existing node', () => {
        const node = getNode('~/academic');
        expect(node).toBeDefined();
        expect(node.type).toBe('directory');
        
        const fileNode = getNode('~/academic/phd');
        expect(fileNode).toBeDefined();
        expect(fileNode.type).toBe('file');
    });

    test('getNode returns null for non-existing node', () => {
        expect(getNode('~/nonexistent')).toBeNull();
        expect(getNode('~/academic/nonexistent')).toBeNull();
    });

    test('isDirectory and isFile work correctly', () => {
        expect(isDirectory('~')).toBe(true);
        expect(isDirectory('~/academic')).toBe(true);
        expect(isFile('~/academic')).toBe(false);
        
        expect(isFile('~/academic/phd')).toBe(true);
        expect(isDirectory('~/academic/phd')).toBe(false);
        
        expect(isDirectory('~/nonexistent')).toBe(false);
        expect(isFile('~/nonexistent')).toBe(false);
    });

    test('listDirectory lists contents of a directory', () => {
        const contents = listDirectory('~');
        expect(contents).toContain('academic');
        expect(contents).toContain('sys_infra');
        
        const academicContents = listDirectory('~/academic');
        expect(academicContents).toContain('phd');
        expect(academicContents).toContain('uoi_lecturer');
    });

    test('listDirectory throws on file or nonexistent path', () => {
        expect(() => listDirectory('~/academic/phd')).toThrow();
        expect(() => listDirectory('~/nonexistent')).toThrow();
    });

    test('setCurrentDirectory updates current dir', () => {
        expect(setCurrentDirectory('~/academic')).toBe(true);
        expect(getCurrentDirectory()).toBe('~/academic');
        
        expect(setCurrentDirectory('..')).toBe(true);
        expect(getCurrentDirectory()).toBe('~');
    });

    test('setCurrentDirectory throws on file or nonexistent path', () => {
        expect(() => setCurrentDirectory('~/academic/phd')).toThrow();
        expect(() => setCurrentDirectory('~/nonexistent')).toThrow();
    });

    test('getCompletions returns matches', () => {
        const matches = getCompletions('~', 'ac');
        expect(matches).toEqual(['academic']);
        
        const matches2 = getCompletions('~', 'a');
        expect(matches2.sort()).toEqual(['academic', 'ai_ml'].sort());
        
        setCurrentDirectory('~/academic');
        const matches3 = getCompletions('~/academic', 'p');
        expect(matches3).toEqual(['phd']);
    });
    
    test('getCompletions with path prefix', () => {
        const matches = getCompletions('~', 'academic/p');
        expect(matches).toEqual(['academic/phd']);
    });
});
