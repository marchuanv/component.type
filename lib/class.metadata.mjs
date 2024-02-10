import { ClassFile } from './class.file.mjs';
const privateBag = new WeakMap();
export class ClassMetadata {
    /**
     * @param { ClassFile } classFile
    */
    constructor(classFile) {
        if (!privateBag.has(classFile)) {
            const fileName = classFile.pathInfo.fileName;
            let Id = classFile.Id.split('-')[0];
            Id = `${Id}-${fileName}`;
            const imports = [];
            const exports = [];
            const filePath = classFile.pathInfo.relativePath;
            privateBag.set(classFile, { Id, filePath, exports, imports });
            if (classFile.parent) {
                imports.push(new ClassMetadata(classFile.parent));
            }
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
     * @param { String } value
    */
    set filePath(value) {
        const bag = privateBag.get(this);
        bag.filePath = value;
    }
    /**
     * @returns { Array<ClassMetadata> }
    */
    get exports() {
        const { exports } = privateBag.get(this);
        return exports;
    }
    /**
     * @returns { Array<ClassMetadata> }
    */
    get imports() {
        const { imports } = privateBag.get(this);
        return imports;
    }
}