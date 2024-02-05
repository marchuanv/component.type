import { ClassFile } from './class.file.mjs';
const privateBag = new WeakMap();
export class ClassMetadata {
    /**
     * @param { ClassFile } classFile
    */
    constructor(classFile) {
        if (!privateBag.has(classFile)) {
            let Id = classFile.Id.split('-')[0];
            const exports = [ this ];
            const imports = [];
            const filePath = classFile.pathInfo.relativePath;
            let parent = classFile.parent;
            while (parent) {
                const parentMetadata = new ClassMetadata(parent);
                imports.push(parentMetadata);
                exports.push(parentMetadata);
                parent = parent.parent;
            }
            privateBag.set(classFile, {Id, classes: classFile.classes, filePath, imports, exports });
        }
        const metadata = privateBag.get(classFile);
        privateBag.set(this, metadata);
    }
    /**
     * @returns { String }
    */
    get Id() {
        const { Id } = privateBag.get(this);
        return Id;
    }
    /**
     * @returns { String }
    */
     get filePath() {
        const { filePath } = privateBag.get(this);
        return filePath;
    }
    /**
     * @returns { String }
    */
    get classes() {
        const { classes } = privateBag.get(this);
        return classes;
    }
    /**
     * @returns { Array<ClassMetadata> }
    */
    get imports() {
        const { imports } = privateBag.get(this);
        return imports;
    }
    /**
     * @returns { Array<ClassMetadata> }
    */
     get exports() {
        const { exports } = privateBag.get(this);
        return exports;
    }
}