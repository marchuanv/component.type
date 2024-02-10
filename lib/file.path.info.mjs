import { existsSync, statSync } from 'node:fs';
import path, { join } from 'node:path';
import { DirectoryPathInfo } from './directory.path.info.mjs';
import { randomUUID } from 'node:crypto';
const privateBag = new WeakMap();
export class FilePathInfo {
    /**
     * @param { DirectoryPathInfo } directory
     * @param { String } fileName
    */
    constructor(directory, fileName) {
        const filePath = join(directory.absolutePath, fileName);
        if (!existsSync(filePath)) {
            throw new Error(`${filePath} file does not exist`);
        }
        const stats = statSync(filePath);
        if (stats.isDirectory()) {
            throw new Error(`${filePath} is a directory`);
        }
        const properties = {
            Id: randomUUID(),
            absolutePath: null,
            relativePath: null,
            directory,
            fileName
        };
        privateBag.set(this, properties);
        properties.absolutePath = filePath;
        properties.relativePath = path.join(directory.relativePath, fileName);
        if (!existsSync(properties.relativePath)) {
            throw new Error(`${properties.relativePath} does not exist`);
        }
    }
    /**
     * @return { String }
    */
     get Id() {
        const { Id } = privateBag.get(this);
        return Id;
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
     * @returns { String }
    */
    get fileName() {
        const { fileName } = privateBag.get(this);
        return fileName;
    }
    /**
     * @returns { DirectoryPathInfo }
    */
    get directory() {
        const { directory } = privateBag.get(this);
        return directory;
    }
}