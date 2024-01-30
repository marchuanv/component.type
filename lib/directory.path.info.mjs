import { existsSync, readdirSync, statSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve } from 'node:path';
import { FilePathInfo } from './file.path.info.mjs';
const moduleDirPath = resolve('./');
const privateBag = new WeakMap();
export class DirectoryPathInfo {
    /**
     * @param { String } directoryPath
    */
    constructor(directoryPath) {
        if (!existsSync(directoryPath)) {
            throw new Error(`${directoryPath} directory does not exist.`);
        }
        const stats = statSync(directoryPath);
        if (!stats.isDirectory()) {
            throw new Error(`${directoryPath} is not a directory`);
        }
        const properties = {
            absolutePath: null,
            relativePath: null,
            parent: null,
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
        let relativeDirPathSplit = properties.relativePath.split('\\');
        if (relativeDirPathSplit.length === 1) {
            relativeDirPathSplit = properties.relativePath.split('/');
        }
        const filePaths = readdirSync(properties.absolutePath).filter(filePath =>
            filePath.endsWith('.mjs') &&
            !(
                filePath.endsWith('class.file.mjs') ||
                filePath.endsWith('directory.path.info.mjs') ||
                filePath.endsWith('file.path.info.mjs')
            )
        );
        for (const filePath of filePaths) {
            const fileName = basename(filePath);
            const filePathInfo = new FilePathInfo(this, fileName);
            properties.children.push(filePathInfo);
        }
        let relativeParentDirPath = relativeDirPathSplit[relativeDirPathSplit.length - 2];
        if (relativeParentDirPath) {
            relativeParentDirPath = relative(moduleDirPath, relativeParentDirPath);
            properties.parent = new DirectoryPathInfo(relativeParentDirPath);
        }
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
}