import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ApplicationModule } from './lib/application.module.mjs';
import { ClassTree } from "./lib/class.tree.mjs";

(async () => {
    const appModule = new ApplicationModule();
    let index = 0;
    let registryScriptFilePath = join(appModule.directory.absolutePath, `registry.${index}.mjs`);
    while (existsSync(registryScriptFilePath)) {
        rmSync(registryScriptFilePath);
        index = index + 1;
        registryScriptFilePath = join(appModule.directory.absolutePath, `registry.${index}.mjs`);
    }
    const classTree = new ClassTree(appModule);
    classTree.walkMetadata((metadata, depth) => {
        // console.log(metadata.classNames);
        registryScriptFilePath = join(appModule.directory.absolutePath, `registry.${depth + 1}.mjs`);
        let content = '';
        if (!existsSync(registryScriptFilePath)) {
            content = `${content}\r\nimport { ${metadata.classNames.reduce((con, className) => {
                con = `${con}\r\n${className},`;
                return con;
            }, '')} } from './registry.${depth}.mjs';`;

            content = `${content}\r\nexport { ${metadata.classNames.reduce((con, className) => {
                con = `${con}\r\n${className},`;
                return con;
            }, '')} };`;

            writeFileSync(registryScriptFilePath, content);
        }
        content = '';
        registryScriptFilePath = join(appModule.directory.absolutePath, `registry.${depth}.mjs`);
        if (existsSync(registryScriptFilePath)) {
            content = readFileSync(registryScriptFilePath, 'utf8');
        }
        for (const className of metadata.classNames) {
            content = `${content}\r\nexport {${className}} from './${metadata.exportPathInfo.relativePath.replace(/\\/g, '/')}';`;
        }
        writeFileSync(registryScriptFilePath, content);
    });
})().catch(err => console.log(err));