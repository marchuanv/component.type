import { ApplicationModule } from './application.module.mjs';
import { ClassFile } from './class.file.mjs';
import { ClassMetadata } from './class.metadata.mjs';
import { DirectoryPathInfo } from './directory.path.info.mjs';
import { FilePathInfo } from './file.path.info.mjs';
const privateBag = new WeakMap();
/**
 * @callback walkMetadataCallback
 * @param { ClassMetadata } metadata
 * @param { Number } depth
*/
export class ClassTree {
    /**
     * @param { ApplicationModule } appModule
    */
    constructor(appModule) {
        let classFiles = [];
        next(appModule.directory, (filePathInfo) => {
            const classFile = new ClassFile(appModule, filePathInfo);
            if (classFile.classes.length > 0) {
                classFiles.push(classFile);
            }
        });
        const rootClassFiles = [];
        let classFile = classFiles.shift();
        while (classFile) {
            if (!classFile.parent) {
                rootClassFiles.push(classFile);
            }
            classFile = classFiles.shift();
        }
        privateBag.set(this, rootClassFiles);
    }
    /**
     * @param  { walkMetadataCallback } callback
     * @param  { ClassFile } parentClassFile
     * @param  { ClassFile } classFile
     * @param  { Number } depth
    */
    walkMetadata(callback, parentClassFile, classFile = null, depth = 0) {
        if (classFile) {
            if (parentClassFile) {
                callback(new ClassMetadata({
                    classNames: classFile.classes,
                    exportPathInfo: classFile.pathInfo,
                    importPathInfo: parentClassFile.pathInfo
                }), depth);
            } else {
                callback(new ClassMetadata({
                    classNames: classFile.classes,
                    exportPathInfo: classFile.pathInfo,
                    importPathInfo: null
                }), depth);
            }
            for (const childClassFile of classFile.children) {
                this.walkMetadata(callback, classFile, childClassFile, depth + 1);
            }
        } else {
            const rootClassFiles = privateBag.get(this);
            for (const rootClassFile of rootClassFiles) {
                this.walkMetadata(callback, null, rootClassFile, depth + 1);
            }
        }
    }
}
/**
 * @param { DirectoryPathInfo } directory
 * @param { Function } callback
*/
function next(directory, callback) {
    const childDirectories = directory.children.filter(child => child instanceof DirectoryPathInfo);
    const childFiles = directory.children.filter(child => child instanceof FilePathInfo);
    for (const filePathInfo of childFiles) {
        callback(filePathInfo)
    }
    for (const childDirectory of childDirectories) {
        next(childDirectory, callback);
    }
}