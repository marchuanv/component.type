import { existsSync, readFileSync, statSync } from 'utils';
const privateBag = new WeakMap();
export class ClassFile {
    /**
     * @param { String } classFilePath
    */
    constructor(classFilePath) {
        if (!existsSync(classFilePath)) {
            throw new Error(`${classFilePath} file does not exist`);
        }
        const stats = statSync(classFilePath);
        if (stats.isDirectory()) {
            throw new Error(`${classFilePath} is a directory`);
        }
        const classExportRegEx = /(?<=export\sclass\s)[a-zA-Z0-9]+/g;
        const classImportRegEx = /(?<=import)\s*[\s\S]+(?=from)/g;
        privateBag.set(this, {
            classExportRegEx,
            classImportRegEx,
            classFilePath,
            imports: [],
            exports: []
        });
    }
    async load() {
        const {
            classFilePath,
            exports,
            imports,
            classExportRegEx,
            classImportRegEx
        } = privateBag.get(this);
        const content = readFileSync(classFilePath, 'utf8');

        classExportRegEx.lastIndex = -1;
        let match = classExportRegEx.exec(content);
        while (match) {
            const className = match[0];
            exports.push(className);
            match = classExportRegEx.exec(content);
        }

        classImportRegEx.lastIndex = -1;
        match = classImportRegEx.exec(content);
        while (match) {
            const importsStr = match[0]
                .replace(/[\s\S]+\{/g, '')
                .replace(/\}[\s\S]+/g, '');
            const _imports = importsStr.split(',').map(x => x.replace(/\s+/g, ''));
            for (const className of _imports) {
                imports.push(className);
            }
            match = classImportRegEx.exec(content);
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