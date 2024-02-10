import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DirectoryPathInfo } from './directory.path.info.mjs';
import { FilePathInfo } from './file.path.info.mjs';
const privateBag = new WeakMap();
export class ClassFile {
    /**
     * @param { DirectoryPathInfo } directory
     * @param { FilePathInfo } pathInfo
    */
    constructor(directory, pathInfo) {
        if (privateBag.has(pathInfo)) {
            const classFile = privateBag.get(pathInfo);
            privateBag.set(this, classFile);
            return;
        }
        privateBag.set(pathInfo, this);
        let match = null;
        const { absolutePath } = pathInfo;
        const properties = {
            Id: pathInfo.Id,
            parent: null,
            imports: [],
            pathInfo,
            children: []
        };
        const content = readFileSync(absolutePath, 'utf8');
        privateBag.set(this, properties);
        //imports
        const impRegEx = /import\s+(?:{[^{}]+}|.*?)\s*(?:from)?\s*['"].*?['"]|import\(.*?\)/g;
        const importPaths = [];
        match = impRegEx.exec(content);
        while(match) {
            const importStr = match[0];
            match = /(?=\.)[\.\\\/a-zA-Z0-9]+(?!=\.mjs)/g.exec(importStr);
            if (match) {
                const importPath = match[0];
                importPaths.push(importPath);
                properties.imports.push(importStr);
            }
            match = impRegEx.exec(content);
        }
        for (const importedFilePath of importPaths) {
            let dirLevel = 0;
            const regEx = /(\.\.\\)|(\.\.\/)/g;
            match = regEx.exec(importedFilePath);
            while (match) {
                dirLevel = dirLevel + 1;
                match = regEx.exec(importedFilePath);
            }
            regEx.lastIndex = 0;
            let importedFileDir = pathInfo.directory;
            while (importedFileDir && dirLevel > 0) {
                dirLevel = dirLevel - 1;
                importedFileDir = importedFileDir.parent;
            }
            let _importedFilePath = importedFilePath.replace(regEx, '/');
            _importedFilePath = join('/', importedFileDir.directoryName, _importedFilePath);
            directory.walk((_filePathInfo) => {
                if (_filePathInfo.absolutePath.endsWith(_importedFilePath)) {
                    properties.parent = new ClassFile(directory, _filePathInfo);
                    properties.parent.children.push(this);
                }
            });
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
     * @return { Array<String> }
    */
    get imports() {
        const { imports } = privateBag.get(this);
        return imports;
    }
    /**
     * @param { ClassFile } value
    */
    set parent(value) {
        const bag = privateBag.get(this);
        bag.parent = value;
    }
    /**
     * @return { ClassFile }
    */
    get parent() {
        const { parent } = privateBag.get(this);
        return parent;
    }
    /**
     * @return { Array<ClassFile> }
    */
    get children() {
        const { children } = privateBag.get(this);
        return children;
    }
    /**
     * @returns { FilePathInfo }
    */
    get pathInfo() {
        const { pathInfo } = privateBag.get(this);
        return pathInfo;
    }
}