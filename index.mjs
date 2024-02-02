import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApplicationModule } from './lib/application.module.mjs';
import { ClassTree } from "./lib/class.tree.mjs";
import { DirectoryPathInfo } from './lib/directory.path.info.mjs';
const destRegistryDirName = '049d38dc';
(async () => {
    const appModule = new ApplicationModule();
    let destRegistryDirPath = join(appModule.directory.absolutePath, destRegistryDirName);
    if (existsSync(destRegistryDirPath)) {
        rmSync(destRegistryDirPath, { recursive: true, force: true });
    }
    mkdirSync(destRegistryDirPath);
    const registryDirPathInfo = new DirectoryPathInfo(destRegistryDirPath, appModule.directory);
    let registryConfigFilePath = join(registryDirPathInfo.absolutePath, `index.json`);
    let registryScriptFilePath = join(registryDirPathInfo.absolutePath, `registry.mjs`);
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
        let content = '';
        const { imports, classNames, filePath } = registry[key];
        let fileName = key.split('-')[0];
        const _registryScriptFilePath = join(registryDirPathInfo.absolutePath, `${fileName}.mjs`);
        const exportClassNames = [];
        const importClassNames = [];
        exportClassNames.push({ Id: key, classNames });
        for (const Id of imports) {
            const impReg = registry[Id];
            if (!importClassNames.find(x => x.Id === Id)) {
                const imp = { Id, classNames: impReg.classNames };
                importClassNames.push(imp);
            }
        };
        let relativePath = '';
        let imp = importClassNames.shift();
        while (imp) {
            const { Id, classNames } = imp;
            fileName = Id.split('-')[0];
            relativePath = `./${fileName}.mjs`;
            content = `${content}\r\nimport { ${classNames.reduce((con, className, index) => {
                if (index === (classNames.length - 1)) {
                    con = `${con}\r\n${className}`;
                } else {
                    con = `${con}\r\n${className},`;
                }
                return con;
            }, '')}} from '${relativePath}';`;
            imp = importClassNames.shift();
        }
        relativePath = `../${filePath}`;
        let exp = exportClassNames.shift();
        while (exp) {
            const { classNames } = exp;
            content = `${content}\r\nexport { ${classNames.reduce((con, className, index) => {
                if (index === (classNames.length - 1)) {
                    con = `${con}\r\n${className}`;
                } else {
                    con = `${con}\r\n${className},`;
                }
                return con;
            }, '')}} from '${relativePath}';`;
            exp = exportClassNames.shift();
        }
        writeFileSync(_registryScriptFilePath, content);
    }
})().catch(err => console.log(err));