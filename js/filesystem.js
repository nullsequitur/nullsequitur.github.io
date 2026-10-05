import { siteData } from './content.js';

let currentDirectory = '/';

export function resolvePath(currentDir, targetPath) {
    if (!targetPath) return currentDir;
    
    let parts;
    let isAbsolute = targetPath.startsWith('/');
    
    if (isAbsolute) {
        parts = targetPath.split('/').filter(p => p !== '');
    } else {
        parts = [...currentDir.split('/'), ...targetPath.split('/')].filter(p => p !== '');
    }
    
    const resolvedParts = [];
    for (const part of parts) {
        if (part === '.') {
            continue;
        } else if (part === '..') {
            resolvedParts.pop();
        } else {
            resolvedParts.push(part);
        }
    }
    
    return '/' + resolvedParts.join('/');
}

export function getNode(path) {
    const resolvedPath = resolvePath(currentDirectory, path);
    if (resolvedPath === '/') {
        return { type: 'directory', children: siteData.filesystem };
    }
    
    const parts = resolvedPath.split('/').filter(p => p !== '');
    let current = { type: 'directory', children: siteData.filesystem };
    
    for (const part of parts) {
        if (current && current.type === 'directory' && current.children && current.children[part]) {
            current = current.children[part];
        } else {
            return null;
        }
    }
    
    return current;
}

export function isDirectory(path) {
    const node = getNode(path);
    return node !== null && node.type === 'directory';
}

export function isFile(path) {
    const node = getNode(path);
    return node !== null && node.type === 'file';
}

export function listDirectory(path) {
    const node = getNode(path);
    if (!node) {
        throw new Error(`ls: cannot access '${path}': No such file or directory`);
    }
    if (node.type !== 'directory') {
        throw new Error(`ls: cannot list '${path}': Not a directory`);
    }
    
    return Object.keys(node.children || {});
}

export function getCompletions(currentDir, partialString) {
    let targetDir = currentDir;
    let prefix = partialString;
    
    const lastSlashIdx = partialString.lastIndexOf('/');
    if (lastSlashIdx !== -1) {
        const dirPart = partialString.substring(0, lastSlashIdx + 1);
        prefix = partialString.substring(lastSlashIdx + 1);
        targetDir = resolvePath(currentDir, dirPart);
    }
    
    try {
        const items = listDirectory(targetDir);
        return items.filter(item => item.startsWith(prefix));
    } catch (e) {
        return [];
    }
}

export function getCurrentDirectory() {
    return currentDirectory;
}

export function setCurrentDirectory(path) {
    const resolvedPath = resolvePath(currentDirectory, path);
    if (isDirectory(resolvedPath)) {
        currentDirectory = resolvedPath;
        return true;
    }
    throw new Error(`cd: ${path}: No such file or directory`);
}
