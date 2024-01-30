import { ClassFile } from './class.file.mjs';
import { FilePathInfo } from './file.path.info.mjs';
export class ClassMetadata extends ClassFile {
    /**
     * @param { FilePathInfo } pathInfo
    */
    constructor(pathInfo) {
        super(pathInfo);
    }
    /**
     * @returns { Array<ClassMetadata> }
    */
    get exportMetadata() {
        return super.exports;
    }
    /**
     * @returns { Array<ClassMetadata> }
    */
    get importMetadata() {
        return super.imports;
    }
}