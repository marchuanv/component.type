import { copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { existsSync, importExtended, resolve } from "utils";

let directoryPath = process.argv[2];
if (directoryPath) {
    directoryPath = resolve(directoryPath);
}
if (!existsSync(directoryPath)) {
    throw new Error(`${directoryPath} directory does not exist`);
}

const filePathInfoScriptName = 'file.path.info.mjs';
const directoryPathInfoScriptName = 'directory.path.info.mjs';
const classFileScriptName = 'class.file.mjs';
const classMetadataScriptName = 'class.metadata.mjs';
const applicationModuleScriptName = 'application.module.mjs';

const filePathInfoScriptPath = join(directoryPath, filePathInfoScriptName);
const directoryPathInfoScriptPath = join(directoryPath, directoryPathInfoScriptName);
const classFileScriptPath = join(directoryPath, classFileScriptName);
const classMetadataScriptPath = join(directoryPath, classMetadataScriptName);
const applicationModuleScriptPath = join(directoryPath, applicationModuleScriptName);

copyFileSync(`./lib/${filePathInfoScriptName}`, filePathInfoScriptPath);
copyFileSync(`./lib/${directoryPathInfoScriptName}`, directoryPathInfoScriptPath);
copyFileSync(`./lib/${classFileScriptName}`, classFileScriptPath);
copyFileSync(`./lib/${classMetadataScriptName}`, classMetadataScriptPath);
copyFileSync(`./lib/${applicationModuleScriptName}`, applicationModuleScriptPath);

function sort(allClassMetadata) {
    return allClassMetadata.sort((classA) => {
        const classAImports = classA.importMetadata.map(x => x.className);
        if (classAImports.length === 0) {
            return -1;
        }
        const findClassThatExportsIndex = allClassMetadata
            .findIndex(c => c.exportMetadata.find(meta => classAImports.find(classAName => classAName === meta.className)));
        const classAIndex = allClassMetadata
            .findIndex(c => c.pathInfo.absolutePath === classA.pathInfo.absolutePath);
        if (classAIndex <= findClassThatExportsIndex) {
            return findClassThatExportsIndex + 1;
        }
        return 0;
    });
}

async function next(directoryPathInfo, callback) {
    const { DirectoryPathInfo } = await importExtended.imp(directoryPathInfoScriptPath);
    const { FilePathInfo } = await importExtended.imp(filePathInfoScriptPath);
    const childDirectories = directoryPathInfo.children.filter(child => child instanceof DirectoryPathInfo);
    const childFiles = directoryPathInfo.children.filter(child => child instanceof FilePathInfo);
    for (const filePathInfo of childFiles) {
        callback(filePathInfo)
    }
    for (const childDirectory of childDirectories) {
        await next(childDirectory, callback);
    }
}

(async () => {
    const { ApplicationModule } = await importExtended.imp(applicationModuleScriptPath);
    const { directory } = new ApplicationModule();
    const { ClassMetadata } = await importExtended.imp(classMetadataScriptPath);
    let allClassMetadata = [];
    await next(directory, async (filePathInfo) => {
        const classMetadata = new ClassMetadata(filePathInfo);
        allClassMetadata.push(classMetadata);
    });
    allClassMetadata = sort(allClassMetadata);
    for (const classFile of allClassMetadata) {
        for (const { className, metadata: { pathInfo: { absolutePath } } } of classFile.importMetadata) {
            console.log({ className, absolutePath });
        }
    }
    // const { DirectoryPathInfo } = await importExtended.imp(directoryPathInfoScriptPath);
    // const { ClassFile } = await importExtended.imp(classFileScriptPath);
    // const directoryPathInfo = new DirectoryPathInfo(directoryPath);
    // for (let index = 0; index < directoryPathInfo.children.length; index++) {
    //     const filePathInfo = directoryPathInfo.children[index];
    //     const classFile = ClassFile.create(filePathInfo);
    //     await classFile.load();
    //     if (classFile.imports.length === 0) {
    //         for (const className of classFile.classNames) {
    //             const registryFilePath = join(directoryPath, `${directoryPathInfo.directoryName}-registry-dependencies.mjs`);
    //             let registryContent = '';
    //             if (existsSync(registryFilePath)) {
    //                 registryContent = readFileSync(registryFilePath, 'utf8');
    //             }
    //             registryContent = `${registryContent}\r\nexport {${className}} from './${filePathInfo.fileName}';`;
    //             writeFileSync(registryFilePath, registryContent);
    //         }
    //         directoryPathInfo.children.splice(index, 1);
    //     }
    // }
    // for (const info of directoryPathInfo.children) {
    //     const classFile = ClassFile.create(info);
    //     await classFile.load();
    //     for (const { className, filePathInfo } of classFile.imports) {
    //         const dirFilePath = filePathInfo.directory.absolutePath;
    //         const registryFilePath = join(dirFilePath, `${filePathInfo.directory.directoryName}-registry.mjs`);
    //         let registryContent = '';
    //         if (existsSync(registryFilePath)) {
    //             registryContent = readFileSync(registryFilePath, 'utf8');
    //         }
    //         registryContent = `${registryContent}\r\nexport {${className}} from './${filePathInfo.fileName}';`;
    //         writeFileSync(registryFilePath, registryContent);
    //     }
    // }
})().catch(err => console.log(err))
    .finally(() => {
        rmSync(filePathInfoScriptPath);
        rmSync(directoryPathInfoScriptPath);
        rmSync(classFileScriptPath);
        rmSync(classMetadataScriptPath);
        rmSync(applicationModuleScriptPath);
    });