import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
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
    //resolve all imports
    for (const key of Object.keys(registry)) {
        const { imports } = registry[key];
        const resolvedImports = getImportConfig(registry, imports);
        for(let index = 0; index < imports.length; index++) {
            imports[index] = resolvedImports[index];
        }
    }
    //remove duplicates
    for (const key of Object.keys(registry)) {
        const obj = registry[key].imports.reduce((obj, imp) => {
            obj.imports.push(imp);
            const { imports } = imp.imports.reduce((obj2, imp2) => {
                obj2.imports.push(imp2);
                return obj2;
            },{ imports: [] });
            obj.imports = obj.imports.concat(imports);
            return obj;
        },{ imports: [] });
        const _imports = [];
        let imp = obj.imports.shift();
        while(imp) {
            if(!_imports.find(_imp => _imp.Id === imp.Id)) {
                _imports.push(imp);
            }
            let imp2 = imp.imports.shift();
            while(imp2) {
                if(!_imports.find(_imp2 => _imp2.Id === imp2.Id)) {
                    _imports.push(imp2);
                }
                imp2 = imp2.imports.shift();
            }
            imp = obj.imports.shift();
        }
        const finalImport = _imports[0];
        if (finalImport) {
            const { classes } = _imports.reduce((obj, { classNames }) => {
                obj.classes = obj.classes.concat(classNames);
                return obj;
            }, { classes: [] });
            finalImport.classNames = classes;
            registry[key].imports = [finalImport];
        }
    }
    writeFileSync(registryConfigFilePath, JSON.stringify(registry, null, 4));
    for (const key of Object.keys(registry)) {
        let content = '';
        const { imports, classNames, filePath } = registry[key];
        let fileName = key.split('-')[0];
        const _registryScriptFilePath = join(registryDirPathInfo.absolutePath, `${fileName}.mjs`);
        let relativePath = '';
        let resolvedImports = JSON.parse(JSON.stringify(imports));
        let imp = resolvedImports.shift();
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
            imp = resolvedImports.shift();
        }
        relativePath = `../${filePath}`;
        content = `${content}\r\nexport { ${classNames.reduce((con, className, index) => {
            if (index === (classNames.length - 1)) {
                con = `${con}\r\n${className}`;
            } else {
                con = `${con}\r\n${className},`;
            }
            return con;
        }, '')}} from '${relativePath}';`;
        resolvedImports = JSON.parse(JSON.stringify(imports));
        let exp = resolvedImports.shift();
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
