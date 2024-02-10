import { ClassFile } from './class.file.mjs';
import { FilePathInfo } from './file.path.info.mjs';
const privateBag = new WeakMap();
export class ClassFileExport {
    /**
     * @param { ClassFile } classFile
    */
    constructor(classFile) {
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
        if (types.length > 1) {
            throw new Error(`${classFile.pathInfo.absolutePath} can only have one export`);
        }
        const { Id, pathInfo } = classFile;
        privateBag.set(this, {
            Id,
            className: types[0],
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