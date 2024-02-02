import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApplicationModule } from './lib/application.module.mjs';
import { ClassTree } from "./lib/class.tree.mjs";
import { DirectoryPathInfo } from './lib/directory.path.info.mjs';
const destRegistryDirName = '049d38dc';
/**
 * @param { Object } registry
 * @param { Array<String> } importIds
 * @returns { Array<{ Id: String, classNames: Array<String>, imports: Array<String> }> }
*/
function getImportConfig(registry, importIds) {
    return importIds.map((Id) => {
        const { imports, classNames } = registry[Id];
        return {
            Id,
            classNames,
            imports
        };
    });
}

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
        let resolvedImports = [];
        exportClassNames.push({ Id: key, classNames });
        for (const impConfig of getImportConfig(registry, imports)) {
            const { Id, imports } = impConfig;
            if (!resolvedImports.find(x => x.Id === Id)) {
                for (const impConfig2 of getImportConfig(registry, imports)) {
                    const impConfig2Cloned = JSON.parse(JSON.stringify(impConfig2));
                    resolvedImports.push(impConfig2Cloned);
                }
                resolvedImports.push(impConfig);
            }
        };
        resolvedImports = resolvedImports.map(imp => {
            let count = resolvedImports.filter(imp2 => imp2.Id === imp.Id).length;
            if (count > 1) {
                const index = resolvedImports.findIndex(imp2 => imp2.Id === imp.Id);
                resolvedImports.splice(index, 1);
                return null;
            }
            return imp;
        }).filter(imp => imp);
        let relativePath = '';
        const resolvedImportsClone = JSON.parse(JSON.stringify(resolvedImports));
        let imp = resolvedImportsClone.shift();
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
            imp = resolvedImportsClone.shift();
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
        exp = resolvedImports.shift();
        while (exp) {
            const { classNames } = exp;
            content = `${content}\r\nexport { ${classNames.reduce((con, className, index) => {
                if (index === (classNames.length - 1)) {
                    con = `${con}\r\n${className}`;
                } else {
                    con = `${con}\r\n${className},`;
                }
                return con;
            }, '')}}`;
            exp = resolvedImports.shift();
        }
        writeFileSync(_registryScriptFilePath, content);
    }
})().catch(err => console.log(err));
