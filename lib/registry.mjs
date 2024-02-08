import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ClassFile } from './class.file.mjs';
import { ClassMetadata } from './class.metadata.mjs';
import { DirectoryPathInfo } from "./directory.path.info.mjs";
const destRegistryDirName = '049d38dc';
const privateBag = new WeakMap();
export class Registry {
    constructor() {
        const moduleDirPath = process.cwd();
        const directory = new DirectoryPathInfo(moduleDirPath, null)
        let destRegistryDirPath = join(directory.absolutePath, destRegistryDirName);
        if (existsSync(destRegistryDirPath)) {
            rmSync(destRegistryDirPath, { recursive: true, force: true });
        }
        mkdirSync(destRegistryDirPath);
        const allMetadata = [];
        directory.walk((filePathInfo) => {
            const classFile = new ClassFile(directory, filePathInfo);
            const metadata = new ClassMetadata(classFile);
            metadata.filePath = `../${metadata.filePath.replace(/\\/g, '/')}`;
            allMetadata.push(metadata);
        });
        privateBag.set(this, {
            metadata: allMetadata,
            directory: new DirectoryPathInfo(destRegistryDirPath, directory)
        });
    }
    create(metadata = null, regFilePath = null, depRegFilePath = null) {
        const { directory } = privateBag.get(this);
        if (metadata) {
            if (metadata.classes.length === 0 && metadata.imports.length === 0) {
                return;
            }
            if (!existsSync(regFilePath)) {
                writeFileSync(regFilePath, '');
            }
            let content = readFileSync(regFilePath, 'utf8');
            if (depRegFilePath) {

                let importContent = `import {`;
                for (const metaImport of metadata.imports) {
                    for (const className of metaImport.classes) {
                        importContent = `${importContent}\r\n${className},`;
                    }
                }
                const importFilePath = relative(destRegistryDirName, depRegFilePath);
                importContent = `${importContent}} from './${importFilePath}';`;
                if (content.indexOf(importContent) === -1) {
                    content = `${content}\r\n${importContent}`;
                }

                let exportContent = `export {`;
                for (const className of metadata.classes) {
                    exportContent = `${exportContent}\r\n${className},`;
                }
                exportContent = `${exportContent}} from './${metadata.filePath}';`;
                if (content.indexOf(exportContent) === -1) {
                    content = `${content}\r\n${exportContent}`;
                }

                exportContent = `export {`;
                for (const metaImport of metadata.imports) {
                    for (const className of metaImport.classes) {
                        exportContent = `${exportContent}\r\n${className},`;
                    }
                }
                exportContent = `${exportContent}};`;
                if (content.indexOf(exportContent) === -1) {
                    content = `${content}\r\n${exportContent}`;
                }

                writeFileSync(regFilePath, content);

                const _metadata = metadata;
                const _depRegFilePath = regFilePath;
                {
                    const { metadata } = privateBag.get(this);
                    const depMetadata = metadata.filter(m => m.imports.find(i => i.Id === _metadata.Id));
                    for (const meta of depMetadata) {
                        const regFilePath = join(directory.relativePath, meta.Id);
                        this.create(meta, regFilePath, _depRegFilePath);
                    }
                }
            } else {
                if (metadata.imports.length === 0) { //no dependencies
                    let exportContent = `export {`;
                    for (const className of metadata.classes) {
                        exportContent = `${exportContent}\r\n${className},`;
                    }
                    exportContent = `${exportContent}} from './${metadata.filePath}'`;
                    if (content.indexOf(exportContent) === -1) {
                        content = `${content}\r\n${exportContent}`;
                    }
                    writeFileSync(regFilePath, content);
                    const _metadata = metadata;
                    const _depRegFilePath = regFilePath;
                    {
                        const { metadata } = privateBag.get(this);
                        const depMetadata = metadata.filter(m => m.imports.find(i => i.Id === _metadata.Id));
                        for (const meta of depMetadata) {
                            const regFilePath = join(directory.relativePath, meta.Id);
                            this.create(meta, regFilePath, _depRegFilePath);
                        }
                    }
                } else {
                    for (const meta of metadata.imports) {
                        const regFilePath = join(directory.relativePath, meta.Id);
                        this.create(meta, regFilePath, depRegFilePath);
                    }
                }
            }
        } else {
            const { metadata } = privateBag.get(this);
            const noDepMetadata = metadata.filter(m => m.imports.length === 0);
            for (const meta of noDepMetadata) {
                const exportRegFilePath = join(directory.relativePath, `exports.mjs`);
                this.create(meta, exportRegFilePath, null);
            }
        }
    }
    /**
     * @returns { DirectoryPathInfo }
    */
    get directory() {
        const { directory } = privateBag.get(this);
        return directory;
    }
}