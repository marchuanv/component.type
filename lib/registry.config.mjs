import { join } from 'node:path';
import { ApplicationModule } from './application.module.mjs';
import { ClassFile } from './class.file.mjs';
import { ClassMetadata } from './class.metadata.mjs';
import { DirectoryPathInfo } from './directory.path.info.mjs';
import { FilePathInfo } from './file.path.info.mjs';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
const destRegistryDirName = '049d38dc';
export class RegistryConfig {
    /**
     * @param { ApplicationModule } appModule
    */
    constructor(appModule) {
        let destRegistryDirPath = join(appModule.directory.absolutePath, destRegistryDirName);
        if (existsSync(destRegistryDirPath)) {
            rmSync(destRegistryDirPath, { recursive: true, force: true });
        }
        mkdirSync(destRegistryDirPath);
        const registryDirPathInfo = new DirectoryPathInfo(destRegistryDirPath, appModule.directory);
        let registryConfigFilePath = join(registryDirPathInfo.absolutePath, `index.json`);
        const config = {};
        const allMetadata = [];
        next(appModule.directory, (filePathInfo) => {
            const classFile = new ClassFile(appModule, filePathInfo);
            const metadata = new ClassMetadata(classFile);
            allMetadata.push(metadata);
        });
        for(const metadata of allMetadata) {
            if (!config[metadata.Id]) {
                config[metadata.Id] = {
                    classes: metadata.classes,
                    filePath: metadata.filePath,
                    imports: [],
                    exports: []
                };
                const entry =  config[metadata.Id];
                for(const _import of metadata.imports) {
                    entry.imports.push(_import.Id);
                }
                for(const _export of metadata.exports) {
                    entry.exports.push(_export.Id);
                }
            }
        }
        writeFileSync(registryConfigFilePath, JSON.stringify(config, null, 4));
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