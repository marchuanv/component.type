import { join, readFileSync, resolve } from 'utils';
import { FilePathInfo } from './file.path.info.mjs';
const privateBag = new WeakMap();
export class ClassFile {
    /**
     * @param { FilePathInfo } pathInfo
    */
    constructor(pathInfo) {
        const classExportRegEx = /(?<=export\sclass\s)[a-zA-Z0-9]+/g;
        const classImportRegEx = /import[\s\S]+\.mjs/;
        privateBag.set(this, {
            pathInfo,
            classExportRegEx,
            classImportRegEx,
            imports: [],
            exports: []
        });
    }
    async load() {
        const {
            pathInfo,
            exports,
            imports,
            classExportRegEx,
            classImportRegEx,
            classFileDirPath,
        } = privateBag.get(this);

        const {
            absolutePath,
            relativePath
        } = pathInfo;

        const content = readFileSync(absolutePath, 'utf8');
        classExportRegEx.lastIndex = -1;
        let match = classExportRegEx.exec(content);
        while (match) {
            const className = match[0];
            exports.push(className);
            match = classExportRegEx.exec(content);
        }
        classImportRegEx.lastIndex = -1;
        match = classImportRegEx.exec(content);
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
                            imports.push({
                                className,
                                filePathInfo: filePathInfoFound
                            });
                        }
                    }
                }
            }
        }
    }
    get imports() {
        const { imports } = privateBag.get(this);
        return imports;
    }
    get exports() {
        const { exports } = privateBag.get(this);
        return exports;
    }
}