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
        let match = null;
        const classExportRegEx = /(?<=export\sclass\s)[a-zA-Z0-9]+/g;
        const classImportRegEx = /import[\s\S]+\.mjs/;
        const { absolutePath } = pathInfo;
        const content = readFileSync(absolutePath, 'utf8');
        const properties = {
            Id: pathInfo.Id,
            classes: [],
            parent: null,
            pathInfo,
            children: []
        };
        privateBag.set(this, properties);
        //exports
        classExportRegEx.lastIndex = -1;
        match = classExportRegEx.exec(content);
        while (match) {
            const className = match[0];
            properties.classes.push(className);
            match = classExportRegEx.exec(content);
        }
        //imports
        classImportRegEx.lastIndex = -1;
        match = classImportRegEx.exec(content);
        let importStrSplit = [];
        if (match) {
            importStrSplit = match[0].split('import').filter(x => x);
        }
        for (const importStr of importStrSplit) {
            match = /(?<=\{)[\s\S]+(?=})/.exec(importStr);
            if (match) {
                match = /(?<=from)[\S\s]+(?=\.mjs)/.exec(importStr);
                if (match) {
                    match = /(?=\.)[\.\\\/a-zA-Z0-9]+(?!=\.mjs)/g.exec(match[0]);
                }
                if (match) {
                    let importedFilePath = `${match[0]}.mjs`;
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
                    importedFilePath = importedFilePath.replace(regEx, '/');
                    importedFilePath = join('/', importedFileDir.directoryName, importedFilePath);
                    directory.walk((_filePathInfo) => {
                        if (_filePathInfo.absolutePath.endsWith(importedFilePath)) {
                            properties.parent = new ClassFile(directory, _filePathInfo);
                            properties.parent.children.push(this);
                        }
                    });
                }
            }
        }
        privateBag.set(pathInfo, this);
    }
    /**
     * @return { String }
    */
    get Id() {
        const { Id } = privateBag.get(this);
        return Id;
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
     * @return { Array<String> }
    */
    get classes() {
        const { classes } = privateBag.get(this);
        return classes;
    }
    /**
     * @returns { FilePathInfo }
    */
    get pathInfo() {
        const { pathInfo } = privateBag.get(this);
        return pathInfo;
    }
}