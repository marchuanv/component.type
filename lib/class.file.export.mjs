import { ClassFile } from './class.file.mjs';
import { FilePathInfo } from './file.path.info.mjs';
const privateBag = new WeakMap();
export class ClassFileExport {
    /**
     * @param { ClassFile } classFile
    */
    constructor(classFile) {
        let className = '';
        if (!privateBag.has(classFile)) {
            let types = [];
            for(const child of classFile.children) {
                const importsOfThisClassFile = child.imports.filter(impStr => impStr.endsWith(classFile.pathInfo.relativePath));
                if (importsOfThisClassFile.length > 1) {
                    throw new Error(`multiple imports from the same class file`);
                }
                const importOfThisClassFile = importsOfThisClassFile[0];
                let match = /(?<={)[\s\S]+(?=})/.exec(importOfThisClassFile);
                if (match) {
                    const typesStr = match[0].replace(/\s/g,'');
                    let _types = typesStr.split(',');
                    types = types.concat(_types)
                }
            }
            types = [...new Set(types)];
            privateBag.set(classFile, types);
        } 
        const { types } = privateBag.get(classFile);
        if (types.length > 0) {
            className = types.shift();
            new ClassFileExport(classFile);
        }
        const { Id, pathInfo } = classFile;
        privateBag.set(this, { Id, className, pathInfo });
        if (!privateBag.get(ClassFileExport).find(exp => exp.pathInfo.absolutePath === this.pathInfo.absolutePath)) {
            privateBag.get(ClassFileExport).push(this);
        }
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
    /**
     * @param { ClassFile } classFile
     * @returns { Array<ClassFileExport> }
    */
    static exports(classFile) {
        const { pathInfo } = classFile;
        return privateBag.get(ClassFileExport).find(({ pathInfo }) => pathInfo.Id === pathInfo.Id);
    }
}