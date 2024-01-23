import { GUID, basename, existsSync, extname, join, readFileSync, walkDir } from "utils";
import { Container } from "./container.mjs";
const dependencyTemplate = {
    Id: ""
};
const typeDefinitionTemplate = {
    Id: "",
    name: "",
    typeName: "",
    isArray: false,
    isReferenceType: false,
    isObject: false
};
const memberParameterTemplate = {
    Id: "",
    name: "",
    typeDefinition: typeDefinitionTemplate
};
const ctorTemplate = {
    Id: "",
    name: "constructor",
    isCtor: true,
    isStatic: false,
    typeDefinition: typeDefinitionTemplate,
    parameters: []
};
const methodTemplate = {
    Id: "",
    name: "",
    isCtor: false,
    isStatic: false,
    typeDefinition: typeDefinitionTemplate,
    parameters: []
};
const propertyTemplate = {
    Id: "",
    name: "",
    isGetter: false,
    isSetter: false,
    isStatic: false,
    typeDefinition: typeDefinitionTemplate,
    parameters: []
};
const classInterfaceTemplate = {
    className: "",
    Id: "",
    scriptFilePath: "",
    dependencies: [],
    ctor: ctorTemplate,
    methods: [],
    properties: []
};
const privateBag = new WeakMap();
export class ClassInterfaceRegister {
    /**
     * @param { Array<{ scriptsDirPath: String, scriptFileName: String, targetClass: class }> } config
    */
    static async register(config) {
        const { scripts } = privateBag.get(ClassInterfaceRegister);
        for (const { scriptsDirPath, scriptFileName, targetClass } of config) {
            if (!existsSync(scriptsDirPath)) {
                throw new Error(`${scriptsDirPath} does not exist.`);
            }
            walkDir(scriptsDirPath, (filePath) => {
                if (filePath.endsWith(scriptFileName)) {
                    const scriptFilePath = filePath;
                    const scriptFileName = basename(scriptFilePath);
                    const scriptFileNameExt = extname(scriptFilePath);
                    const name = scriptFileName.replace(scriptFileNameExt, '');
                    if (targetClass.name === name) {
                        const content = readFileSync(scriptFilePath);
                        scripts.push({
                            Id: name,
                            scriptFileName,
                            scriptFilePath,
                            content,
                            scriptDirPath: scriptsDirPath
                        });
                    }
                }
            });
        }
        if (scripts.length !== config.length) {
            throw new Error('not all scripts from config has been registered.');
        }
    }
    /**
     * @param { class } targetClass
    */
    static async generate(targetClass) {
        const { scripts } = privateBag.get(ClassInterfaceRegister);
        const className = targetClass.name;
        const { name, scriptDirPath, scriptFileName, scriptFilePath, content } = scripts.find(script => script.Id === className);
        const classInterfaceConfigFilePath = join(scriptDirPath, `${name}.interface.json`);

        const classInterface = JSON.parse(JSON.stringify(classInterfaceTemplate));
        classInterface.Id = new GUID();
        classInterface.className = className;
        classInterface.scriptFilePath = scriptFilePath;

        classInterface.ctor.Id = new GUID();
        classInterface.ctor.typeDefinition.Id = new GUID();
        classInterface.ctor.typeDefinition.name = name;
        classInterface.ctor.typeDefinition.typeName = className;
        classInterface.ctor.typeDefinition.isReferenceType = true;

        for (const paramName of /\w/g.exec(content)) {
            const paramTemplate = JSON.parse(JSON.stringify(memberParameterTemplate));
            paramTemplate.Id = new GUID();
            paramTemplate.name = paramName;
            classInterface.ctor.parameters.push(paramTemplate);
        }

        let prototype = Object.getPrototypeOf(targetClass);
        while (prototype) {
            if (prototype.name && prototype !== Container) {
                const { Id } = await ClassInterfaceRegister.generate(prototype);
                classInterface.dependencies.push(Id);
            }
            prototype = Object.getPrototypeOf(prototype);
        }
        const classInterfaceConfigStr = readFileSync(classInterfaceConfigFilePath);
        const classInterfaceConfig = JSON.parse(classInterfaceConfigStr);
        return classInterfaceConfig;
    }
}
privateBag.set(ClassInterfaceRegister, { scripts: [] });