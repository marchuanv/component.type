import { join, readFileSync, resolve } from 'utils';
import { ClassMetadata } from './class.metadata.mjs';
import { FilePathInfo } from './file.path.info.mjs';
const privateBag = new WeakMap();
export class ClassFile {
    /**
     * @param { FilePathInfo } pathInfo
    */
    constructor(pathInfo) {
        const classExportRegEx = /(?<=export\sclass\s)[a-zA-Z0-9]+/g;
        const classImportRegEx = /import[\s\S]+\.mjs/;
        const { absolutePath } = pathInfo;
        const content = readFileSync(absolutePath, 'utf8');
        privateBag.set(this, {
            pathInfo,
            classExportRegEx,
            classImportRegEx,
            content
        });
    }
    get exports() {
        const {
            content,
            classExportRegEx,
        } = privateBag.get(this);
        classExportRegEx.lastIndex = -1;
        let match = classExportRegEx.exec(content);
        const exports = [];
        while (match) {
            const className = match[0];
            const metadata =
                exports.push({ className, metadata });
            match = classExportRegEx.exec(content);
        }
        return exports;
    }
    get imports() {
        const {
            pathInfo,
            classImportRegEx,
            content
        } = privateBag.get(this);
        const imports = [];
        classImportRegEx.lastIndex = -1;
        let match = classImportRegEx.exec(content);
        let importStrSplit = [];
        if (match) {
            importStrSplit = match[0].split('import').filter(x => x);
        }
        for (const importStr of importStrSplit) {
            match = /(?<=\{)[\s\S]+(?=})/.exec(importStr);
            if (match) {
                const _imports = match[0]
                    .split(',')
                    .map(x => x
                        .replace(/\s+/g, '')
                    );
                for (const className of _imports) {
                    match = /(?<=from)[\S\s]+(?=\.mjs)/.exec(importStr);
                    if (match) {
                        match = /(?=\.)[\.\\\/a-zA-Z0-9]+(?!=\.mjs)/g.exec(match[0]);
                    }
                    if (match) {
                        let importedClassFilePath = `${match[0]}.mjs`;
                        importedClassFilePath = resolve(importedClassFilePath);
                        match = /[a-zA-Z0-9]+\.mjs/g.exec(importedClassFilePath);
                        if (match) {
                            let importedClassFileName = match[0];
                            let directory = pathInfo.directory;
                            let filePathInfoFound = null;
                            while (directory) {
                                for (const _filePathInfo of directory.children) {
                                    if (_filePathInfo.absolutePath === join(directory.absolutePath, importedClassFileName)) {
                                        filePathInfoFound = _filePathInfo;
                                        break;
                                    }
                                }
                                if (filePathInfoFound) {
                                    break;
                                }
                                directory = directory.parent;
                            }
                            if (filePathInfoFound) {
                                const metadata = new ClassMetadata(filePathInfoFound);
                                imports.push({ className, metadata });
                            }
                        }
                    }
                }
            }
        }
        return imports;
    }
    /**
     * @returns { Array<FilePathInfo> }
    */
    get pathInfo() {
        const { pathInfo } = privateBag.get(this);
        return pathInfo;
    }
    /**
     * @param { FilePathInfo } pathInfo
     * @returns { ClassFile }
    */
    static create(pathInfo) {
        return new ClassFile(pathInfo);
    }
}