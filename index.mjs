import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ApplicationModule } from './lib/application.module.mjs';
import { ClassTree } from "./lib/class.tree.mjs";
(async () => {
    const appModule = new ApplicationModule();
    let registryConfigFilePath = join(appModule.directory.absolutePath, `registry.json`);
    while (existsSync(registryConfigFilePath)) {
        rmSync(registryConfigFilePath);

    }
    let registryScriptFilePath = join(appModule.directory.absolutePath, `registry.mjs`);
    while (existsSync(registryScriptFilePath)) {
        rmSync(registryScriptFilePath);
    }
    writeFileSync(registryScriptFilePath, '');
    const classTree = new ClassTree(appModule);
    classTree.walkMetadata(({ classNames, importPathInfo, exportPathInfo }, depth) => {
        let registry = {};
        const exportFilePath = exportPathInfo.relativePath.replace(/\\/g, '/');
        registry[exportPathInfo.Id] = {
            fileName: exportPathInfo.fileName,
            filePath: exportFilePath,
            classNames,
            imports: []
        };
        if (existsSync(registryConfigFilePath)) {
            registry = JSON.parse(readFileSync(registryConfigFilePath, 'utf8'));
        }
        if (!registry[exportPathInfo.Id]) {
            registry[exportPathInfo.Id] = {
                fileName: exportPathInfo.fileName,
                filePath: exportFilePath,
                classNames,
                imports: []
            };
        }
        const { imports } = registry[exportPathInfo.Id];
        if (importPathInfo) {
            const importId = importPathInfo.Id;
            if (!imports.find(Id => Id === importId)) {
                imports.push(importId);
            }
        }
        writeFileSync(registryConfigFilePath, JSON.stringify(registry, null, 4));
    });

    const registry = JSON.parse(readFileSync(registryConfigFilePath));
    for (const key of Object.keys(registry)) {
        const { imports } = registry[key];
        if (imports.length > 0) {
            for (const Id of imports) {
                const registryItem = registry[Id];
                if (!registryItem.created) {
                    registryItem.created = true;
                    const { classNames, filePath } = registry[Id];
                    const relativePath = filePath;
                    let content = readFileSync(registryScriptFilePath, 'utf8');
                    content = `${content}\r\nimport { ${classNames.reduce((con, className, index) => {
                        if (index === 0) {
                            con = `${con}\r\n${className},`;
                        } else {
                            con = `,${con}\r\n${className}`;
                        }
                        return con;
                    }, '')}} from '${relativePath}';`;
                    writeFileSync(registryScriptFilePath, content);
                }
            }
        }
    }

    // const importFileName = basename(importPathInfo.fileName)
    //     .replace(extname(importPathInfo.fileName), '');
    // for(const className of classNames) {
    //     registry[className] = { imports: {} };
    //     const { imports } = registry[className];
    //     imports[fileName] = exportPathInfo.relativePath;
    // }

    // console.log(metadata.classNames);
    // registryScriptFilePath = join(appModule.directory.absolutePath, `registry.${depth + 1}.mjs`);
    // let content = '';
    // if (!existsSync(registryScriptFilePath)) {
    //     content = `${content}\r\nimport { ${metadata.classNames.reduce((con, className) => {
    //         con = `${con}\r\n${className},`;
    //         return con;
    //     }, '')} } from './registry.${depth}.mjs';`;

    //     content = `${content}\r\nexport { ${metadata.classNames.reduce((con, className) => {
    //         con = `${con}\r\n${className},`;
    //         return con;
    //     }, '')} };`;

    //     writeFileSync(registryScriptFilePath, content);
    // }
    // content = '';
    // registryScriptFilePath = join(appModule.directory.absolutePath, `registry.${depth}.mjs`);
    // if (existsSync(registryScriptFilePath)) {
    //     content = readFileSync(registryScriptFilePath, 'utf8');
    // }
    // for (const className of metadata.classNames) {
    //     content = `${content}\r\nexport {${className}} from './${metadata.exportPathInfo.relativePath.replace(/\\/g, '/')}';`;
    // }
    // writeFileSync(registryScriptFilePath, content);

})().catch(err => console.log(err));