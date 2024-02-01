import { FilePathInfo } from './file.path.info.mjs';
const privateBag = new WeakMap();
export class ClassMetadata {
    /**
     * @param { { Id: String, classNames: Array<String>, exportPathInfo: FilePathInfo, importPathInfo: FilePathInfo  } } arg
    */
    constructor(arg) {
        privateBag.set(this, arg);
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
    get classNames() {
        const { classNames } = privateBag.get(this);
        return classNames;
    }
    /**
     * @returns { FilePathInfo }
    */
    get exportPathInfo() {
        const { exportPathInfo } = privateBag.get(this);
        return exportPathInfo;
    }
    /**
     * @returns { FilePathInfo }
    */
    get importPathInfo() {
        const { importPathInfo } = privateBag.get(this);
        return importPathInfo;
    }
}