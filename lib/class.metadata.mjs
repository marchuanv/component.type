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
            const filePath = classFile.pathInfo.relativePath;
            let parent = classFile.parent;
            while (parent) {
                imports.push(new ClassMetadata(parent));
                parent = parent.parent;
            }
            privateBag.set(classFile, { Id, classes: classFile.classes, filePath, imports });
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
}