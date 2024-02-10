import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, isAbsolute, join, relative, resolve } from 'node:path';
import { FilePathInfo } from './file.path.info.mjs';
const moduleDirPath = process.cwd();
const reginclFilePath = join(moduleDirPath, '.regincl');
if (!existsSync(reginclFilePath)) {
    throw new Error(`module ${moduleDirPath} does not have a .regincl file`);
}
let regincl = readFileSync(reginclFilePath, 'utf8');
let reginclSplit = regincl.split(/\r\n/g);
if (reginclSplit.length === 1) {
    reginclSplit = regincl.split(/\n/g);
}
const electedDirectoryPaths = [];
for (const dirPath of reginclSplit) {
    const resolvedPath = resolve(dirPath);
    electedDirectoryPaths.push(resolvedPath);
}
const privateBag = new WeakMap();
/**
 * @callback walkCallback
 * @param { FilePathInfo } filePathInfo
*/
export class DirectoryPathInfo {
    /**
     * @param { String } directoryPath
     * @param { DirectoryPathInfo } parentDirPathInfo
    */
    constructor(directoryPath, parentDirPathInfo) {
        if (!existsSync(directoryPath)) {
            throw new Error(`${directoryPath} directory does not exist.`);
        }
        const stats = statSync(directoryPath);
        if (!stats.isDirectory()) {
            throw new Error(`${directoryPath} is not a directory`);
        }
        const directoryName = basename(directoryPath);
        let found = privateBag.get(DirectoryPathInfo)
            .find(dirPathInfo => dirPathInfo.absolutePath === directoryPath || dirPathInfo.relativePath === directoryPath);
        if (found) {
            privateBag.set(this, found);
        } else if (directoryPath === moduleDirPath) {
            const directoryName = basename(directoryPath);
            const properties = {
                absolutePath: directoryPath,
                relativePath: directoryName,
                parent: null,
                directoryName,
                children: []
            };
            privateBag.set(this, properties);
            for (const electedDirPath of electedDirectoryPaths) {
                const childDirPathInfo = new DirectoryPathInfo(electedDirPath, this);
                properties.children.push(childDirPathInfo);
            }
            privateBag.get(DirectoryPathInfo).push(this);
        } else {
            const properties = {
                absolutePath: null,
                relativePath: null,
                parent: parentDirPathInfo,
                directoryName,
                children: []
            };
            privateBag.set(this, properties);
            if (isAbsolute(directoryPath)) {
                properties.absolutePath = directoryPath;
                properties.relativePath = relative(moduleDirPath, directoryPath);
            } else {
                properties.absolutePath = resolve(directoryPath);
                properties.relativePath = directoryPath;
            }
            privateBag.get(DirectoryPathInfo).push(this);
            walkDir(properties.absolutePath, (filePath, dirPath) => {
                if (dirPath === properties.absolutePath) {
                    if (filePath.endsWith('.mjs') && !filePath.endsWith('registry.mjs')) {
                        const fileName = basename(filePath);
                        const filePathInfo = new FilePathInfo(this, fileName);
                        properties.children.push(filePathInfo);
                    }
                } else {
                    if (!privateBag.get(DirectoryPathInfo).find(dirPathInfo => dirPathInfo.absolutePath === dirPath || dirPathInfo.relativePath === dirPath)) {
                        const chidDirectoryPathInfo = new DirectoryPathInfo(dirPath, this);
                        properties.children.push(chidDirectoryPathInfo);
                    }
                }
            });
        }
    }
    /**
     * @returns { String }
    */
    get directoryName() {
        const { directoryName } = privateBag.get(this);
        return directoryName;
    }
    /**
     * @returns { String }
    */
    get absolutePath() {
        const { absolutePath } = privateBag.get(this);
        return absolutePath;
    }
    /**
     * @returns { String }
    */
    get relativePath() {
        const { relativePath } = privateBag.get(this);
        return relativePath;
    }
    /**
     * @returns { DirectoryPathInfo }
    */
    get parent() {
        const { parent } = privateBag.get(this);
        return parent;
    }
    /**
     * @returns { Array<FilePathInfo }
    */
    get children() {
        const { children } = privateBag.get(this);
        return children;
    }
    /**
     * @param { walkCallback } callback
    */
    walk(callback) {
        const childDirectories = this.children.filter(child => child instanceof DirectoryPathInfo);
        const childFiles = this.children.filter(child => child instanceof FilePathInfo);
        for (const filePathInfo of childFiles) {
            callback(filePathInfo);
        }
        for (const childDirectory of childDirectories) {
            childDirectory.walk(callback);
        }
    }
}
privateBag.set(DirectoryPathInfo, []);
function walkDir(dir, callback) {
    if (existsSync(dir)) {
        const files = readdirSync(dir);
        for (const f of files) {
            let dirPath = join(dir, f);
            const stat = statSync(dirPath);
            let isDirectory = stat.isDirectory();
            if (isDirectory) {
                walkDir(dirPath, callback);
            } else {
                callback(join(dir, f), dir);
            }
        };
    }
}