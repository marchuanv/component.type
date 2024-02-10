import { ClassFile } from './class.file.mjs';
const privateBag = new WeakMap();
export class ClassFileImport {
    /**
     * @param { ClassFile } classFile
    */
    constructor(classFile) {
        const { Id, className, pathInfo } = classFileExport;
        privateBag.set(this, {
            Id,
            className,
            pathInfo
        });
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
    get className() {
        const { className } = privateBag.get(this);
        return className;
    }
    /**
     * @returns { FilePathInfo }
    */
     get pathInfo() {
        const { pathInfo } = privateBag.get(this);
        return pathInfo;
    }
}