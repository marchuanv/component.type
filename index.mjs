import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { existsSync, importExtended, resolve } from "utils";
let rootDirectoryPath = process.argv[2];
if (rootDirectoryPath) {
    rootDirectoryPath = resolve(rootDirectoryPath);
}
let directoryPath = process.argv[3];
if (directoryPath) {
    directoryPath = resolve(directoryPath);
}
if (!existsSync(directoryPath)) {
    throw new Error(`${directoryPath} directory does not exist`);
}
if (!existsSync(rootDirectoryPath)) {
    throw new Error(`${rootDirectoryPath} directory does not exist`);
}
if (!directoryPath.startsWith(rootDirectoryPath)) {
    throw new Error('directory path is not in directory root');
}

const filePathInfoScriptName = 'file.path.info.mjs';
const directoryPathInfoScriptName = 'directory.path.info.mjs';
const classFileScriptName = 'class.file.mjs';
const filePathInfoScriptPath = join(directoryPath, filePathInfoScriptName);
const directoryPathInfoScriptPath = join(directoryPath, directoryPathInfoScriptName);
const classFileScriptPath = join(directoryPath, classFileScriptName);

copyFileSync(`./lib/${filePathInfoScriptName}`, filePathInfoScriptPath);
copyFileSync(`./lib/${directoryPathInfoScriptName}`, directoryPathInfoScriptPath);
copyFileSync(`./lib/${classFileScriptName}`, classFileScriptPath);

(async () => {
    const { DirectoryPathInfo } = await importExtended.imp(directoryPathInfoScriptPath);
    const { ClassFile } = await importExtended.imp(classFileScriptPath);
    const directoryPathInfo = new DirectoryPathInfo(directoryPath);
    for (const filePathInfo of directoryPathInfo.children) {
        const classFiles = new ClassFile(filePathInfo);
        await classFiles.load();
        for (const _import of classFiles.imports) {
            console.log(JSON.stringify(classFiles.imports));
        }
    }
})().then(() => {
    // rmSync(pathInfoScriptPath);
}).catch(err => console.log(err));

