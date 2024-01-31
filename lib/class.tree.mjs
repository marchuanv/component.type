import { ApplicationModule } from './application.module.mjs';
import { ClassFile } from './class.file.mjs';
import { ClassMetadata } from './class.metadata.mjs';
import { DirectoryPathInfo } from './directory.path.info.mjs';
import { FilePathInfo } from './file.path.info.mjs';
const privateBag = new WeakMap();
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
     * @param  { Function } callback
     * @param  { ClassFile } classFile
    */
    walkMetadata(callback, classFile = null, depth = 0) {
        if (classFile) {
            callback(new ClassMetadata({
                classNames: classFile.classes,
                exportPathInfo: classFile.parent ? classFile.parent.pathInfo : classFile.pathInfo,
                importPathInfo: classFile.parent ? classFile.pathInfo : null
            }), depth);
            for (const childClassFile of classFile.children) {
                this.walkMetadata(callback, childClassFile, depth + 1);
            }
        } else {
            const rootClassFiles = privateBag.get(this);
            for (const rootClassFile of rootClassFiles) {
                this.walkMetadata(callback, rootClassFile, depth);
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