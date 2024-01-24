import { GUID, basename, existsSync, extname, join, readFileSync, walkDir, writeFileSync } from "utils";
import { Container } from "./container.mjs";
import { Schema } from "./schema.mjs";
import { TypeDefinition } from "./type.definition.mjs";
const dependencyTemplate = {
    Id: "",
    isExtend: false
}
const typeDefinitionTemplate = {
    Id: "",
    name: "",
    typeName: "",
    isReferenceType: false,
    isNative: false
};
const memberParameterTemplate = {
    Id: "",
    name: "",
    convertToArray: false,
    typeDefinition: typeDefinitionTemplate
};
const methodTemplate = {
    Id: "",
    name: "",
    isCtor: false,
    isStatic: false,
    convertToArray: false,
    typeDefinition: typeDefinitionTemplate,
    parameters: []
};
const propertyTemplate = {
    Id: "",
    name: "",
    isGetter: false,
    isSetter: false,
    isStatic: false,
    convertToArray: false,
    typeDefinition: typeDefinitionTemplate,
    parameters: []
};
const classInterfaceTemplate = {
    className: "",
    Id: "",
    scriptFilePath: "",
    dependencies: [],
    ctor: methodTemplate,
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
            if (!TypeDefinition.find({ type: targetClass })) {
                walkDir(scriptsDirPath, (filePath) => {
                    if (filePath.endsWith(scriptFileName)) {
                        const scriptFilePath = filePath;
                        const scriptFileName = basename(scriptFilePath);
                        const scriptFileNameExt = extname(scriptFilePath);
                        const name = scriptFileName.replace(scriptFileNameExt, '');
                        if (targetClass.name.toLowerCase() === name) {
                            const content = readFileSync(scriptFilePath, 'utf8');
                            scripts.push({
                                Id: name,
                                scriptFileName,
                                scriptFilePath,
                                content,
                                scriptDirPath: scriptsDirPath,
                                targetClass
                            });
                        }
                    }
                });
            }
        }
        if (scripts.length !== config.length) {
            throw new Error('not all scripts from config has been registered.');
        }
        for (const { Id, scriptDirPath, targetClass } of scripts) {
            const classInterfaceConfigFilePath = join(scriptDirPath, `${Id}.interface.json`);
            TypeDefinition.createClass(classInterfaceConfigFilePath, targetClass);
        }
    }
    /**
     * @param { class } targetClass
    */
    static async generate(targetClass) {
        const { scripts } = privateBag.get(ClassInterfaceRegister);
        const className = targetClass.name;
        const script = scripts.find(script => script.Id === className.toLowerCase());
        const { Id, scriptDirPath, scriptFilePath, content } = script;
        const classInterfaceConfigFilePath = join(scriptDirPath, `${Id}.interface.json`);
        const classInterface = JSON.parse(JSON.stringify(classInterfaceTemplate));
        let prototype = Object.getPrototypeOf(targetClass);
        while (prototype) {
            if (prototype.name && prototype !== Container) {
                const typeName = prototype.name;
                const typeDef = TypeDefinition.find({ typeName });
                const { Id } = typeDef;
                const dependency = JSON.parse(JSON.stringify(dependencyTemplate));
                dependency.Id = Id;
                dependency.isExtend = true;
                classInterface.dependencies.push(dependency);
            }
            prototype = Object.getPrototypeOf(prototype);
        }
        classInterface.Id = (new GUID()).toString();
        classInterface.className = className;
        classInterface.scriptFilePath = scriptFilePath;
        classInterface.ctor.Id = (new GUID()).toString();
        classInterface.ctor.isCtor = true;
        classInterface.ctor.name = 'constructor';
        classInterface.ctor.typeDefinition.Id = classInterface.Id;
        classInterface.ctor.typeDefinition.name = Id;
        classInterface.ctor.typeDefinition.isNative = false;
        classInterface.ctor.typeDefinition.typeName = className;
        classInterface.ctor.typeDefinition.isReferenceType = true;
        const comments = content.split('/**')
            .filter(x => x.indexOf('@param') > -1 || x.indexOf('@returns') > -1)
            .map(x => `/**${x}`);

        const constructorComment = comments.find(x => x.indexOf('constructor(') > -1);
        const constructorCommentIndex = comments.findIndex(x => x.indexOf('constructor') > -1);
        const ctorParametersMatch = /(?<=\/\*\*)[\s\S]*(?=constructor)/.exec(constructorComment);
        if (ctorParametersMatch) {
            classInterface.ctor.parameters = buildParameters(constructorComment);
            const depClassDef = TypeDefinition.types.filter(t => t.isReferenceType && !t.isNative).find(t =>
                classInterface.ctor.parameters.find(p => p.typeDefinition.typeName === t.typeName)
            );
            if (depClassDef) {
                const { Id } = depClassDef;
                const dependency = JSON.parse(JSON.stringify(dependencyTemplate));
                dependency.Id = Id;
                classInterface.dependencies.push(dependency);
            }
            comments.splice(constructorCommentIndex, 1);
        }
        let getterPropertyComment = comments.find(x => /get\s+[a-zA-Z0-9]+\(\)/g.test(x));
        let getterPropertyMatch = /get\s+[a-zA-Z0-9]+\(\)/.exec(getterPropertyComment);
        while (getterPropertyMatch) {
            const property = JSON.parse(JSON.stringify(propertyTemplate));
            const propertyStr = getterPropertyMatch[0];
            let getterCommentIndex = comments.findIndex(x => x.indexOf(propertyStr) > -1);
            const propertyName = propertyStr.replace('get ', '').replace('()', '');
            property.Id = (new GUID()).toString();
            property.name = propertyName;
            property.isGetter = true;
            const commentParams = getParametersFromComment(getterPropertyComment);
            property.convertToArray = commentParams[0].isArray;
            const definitions = getTypeDefinitions(commentParams);
            if (definitions.length === 0) {
                throw new Error('could not find type definition from comments');
            }
            property.typeDefinition = definitions[0];
            classInterface.properties.push(property);
            comments.splice(getterCommentIndex, 1);
            getterPropertyComment = comments.find(x => /get\s+[a-zA-Z0-9]+\(\)/g.test(x));
            getterPropertyMatch = /get\s+[a-zA-Z0-9]+\(\)/.exec(getterPropertyComment);
        }
        let setterPropertyComment = comments.find(x => /set\s+[a-zA-Z0-9]+\([\s\S]*\)/g.test(x));
        let setterPropertyMatch = /set\s+[a-zA-Z0-9]+\([\s\S]*\)/.exec(setterPropertyComment);
        while (setterPropertyMatch) {
            const propertyStr = setterPropertyMatch[0];
            let getterCommentIndex = comments.findIndex(x => x.indexOf(propertyStr) > -1);
            const propertyName = propertyStr.replace('set ', '').replace(/\([\s\S]*\)/g, '');
            const existingProperty = classInterface.properties.find(x => x.name === propertyName);
            if (existingProperty) {
                existingProperty.isSetter = true;
                existingProperty.parameters = buildParameters(setterPropertyComment);
            } else {
                const property = JSON.parse(JSON.stringify(propertyTemplate));
                property.Id = (new GUID()).toString();
                property.name = propertyName;
                property.isSetter = true;
                const commentParams = getParametersFromComment(setterPropertyComment);
                property.convertToArray = commentParams[0].isArray;
                const definitions = getTypeDefinitions(commentParams);
                if (definitions.length === 0) {
                    throw new Error('could not find type definition from comments');
                }
                property.typeDefinition = definitions[0];
                classInterface.properties.push(property);
            }
            comments.splice(getterCommentIndex, 1);
            setterPropertyComment = comments.find(x => /set\s+[a-zA-Z0-9]+\([\s\S]*\)/g.test(x));
            setterPropertyMatch = /set\s+[a-zA-Z0-9]+\([\s\S]*\)/.exec(setterPropertyComment);
        }
        let methodComment = comments.find(x => /[a-zA-Z0-9]+\([\s\S]*\)/g.test(x));
        let methodMatch = /[a-zA-Z0-9]+\([\s\S]*\)/g.exec(methodComment);
        while (methodMatch) {
            const method = JSON.parse(JSON.stringify(methodTemplate));
            const methodStr = methodMatch[0];
            let methodCommentIndex = comments.findIndex(x => x.indexOf(methodStr) > -1);
            const methodName = methodStr.replace(/\([\s\S]*\)/, '');
            method.Id = (new GUID()).toString();
            method.name = methodName;
            const commentParams = getParametersFromComment(methodComment);
            const returnParam = commentParams.find(x => !x.name);
            let returnDef = null;
            if (returnParam) {
                method.convertToArray = returnParam.isArray;
                let definitions = getTypeDefinitions(commentParams);
                returnDef = definitions.find(x => x.typeName === returnParam.typeName);
                if (!returnDef) {
                    throw new Error('could not find return type definition from comments');
                }
            } else {
                const typeDef = TypeDefinition.find({ type: null });
                returnDef = JSON.parse(JSON.stringify(typeDefinitionTemplate));
                if (typeDef) {
                    for (const key of Object.keys(returnDef)) {
                        returnDef[key] = typeDef[key];
                    }
                } else {
                    throw new Error(`could not find type defintion for null`);
                }
            }
            method.typeDefinition = returnDef;
            method.parameters = buildParameters(methodComment);
            classInterface.methods.push(method);
            comments.splice(methodCommentIndex, 1);
            methodComment = comments.find(x => /[a-zA-Z0-9]+\([\s\S]*\)/g.test(x));
            methodMatch = /[a-zA-Z0-9]+\([\s\S]*\)/g.exec(methodComment);
        }
        writeFileSync(classInterfaceConfigFilePath, JSON.stringify(classInterface, null, 4));
        const unvalidatedClassInterface = JSON.parse(readFileSync(classInterfaceConfigFilePath, 'utf8'));
        {
            let classSchema = null;
            try {
                classSchema = Schema.findSchema({ typeId: '540885dc317a40e5b7b0e4549b37dff6', typeName: 'class' });
                await classSchema.validate(unvalidatedClassInterface);
            } catch (error) {
                console.log(error);
                throw new Error(`schema validation failed for ${unvalidatedClassInterface.className}`);
            }
        }
        TypeDefinition.createClass(classInterfaceConfigFilePath, targetClass);
    }
}
privateBag.set(ClassInterfaceRegister, { scripts: [] });

function getParametersFromComment(comment) {
    let _comment = /(?<=\/\*\*)[\s\S]*(?=\*\/)/.exec(comment);
    if (_comment) {
        _comment = _comment[0];
        _comment = _comment
            .replace(/\r/g, '')
            .replace(/\n/g, '')
            .replace(/\\\*\*/g, '')
            .replace(/\*\//g, '')
            .replace(/\s/g, '')
            .replace(/\s/g, '');
        const _commentSplit = _comment.split('*@');
        return _commentSplit.filter(p => p && p.indexOf('template') === -1).map(p => {
            let type = /\{[\s\S]*\}/g.exec(p);
            if (type) {
                type = type[0];
            } else {
                throw new Error('could not determine parameter type');
            }
            if (p.startsWith('returns')) {
                let typeName = type
                    .replace(/\{/g, '')
                    .replace(/\}/g, '');
                let isArray = false;
                if (typeName.toLowerCase().startsWith('array<')) {
                    isArray = true;
                    typeName = typeName.split('<');
                    typeName = typeName[1].replace('>', '');
                }
                return { typeName, isArray };
            } else if (p.startsWith('param')) {
                let typeName = type
                    .replace(/\{/g, '')
                    .replace(/\}/g, '');
                const name = p.replace(`param${type}`, '');
                let isArray = false;
                if (typeName.toLowerCase().startsWith('array<')) {
                    isArray = true;
                    typeName = typeName.split('<');
                    typeName = typeName[1].replace('>', '');
                }
                return { name, typeName, isArray };
            }
        });
    }
}

function getTypeDefinitions(commentParameters) {
    const _typeDefinitions = [];
    for (const { typeName } of commentParameters) {
        const typeDefinition = JSON.parse(JSON.stringify(typeDefinitionTemplate));
        let typeDef = TypeDefinition.find({ typeName });
        if (typeDef) {
            for (const key of Object.keys(typeDefinition)) {
                typeDefinition[key] = typeDef[key];
            }
            _typeDefinitions.push(typeDefinition);
        } else {
            throw new Error(`could not find type defintion for ${typeName}`);
        }
    }
    return _typeDefinitions;
}

function buildParameters(comment) {
    const parameters = [];
    const commentParams = getParametersFromComment(comment);
    const definitions = getTypeDefinitions(commentParams);
    for (const { name, typeName, isArray } of commentParams) {
        if (name) {
            const paramTemplate = JSON.parse(JSON.stringify(memberParameterTemplate));
            paramTemplate.Id = (new GUID()).toString();
            paramTemplate.name = name;
            const typeDef = definitions.find(x => x.typeName.toLowerCase() === typeName.toLowerCase());
            if (!typeDef) {
                throw new Error('could not find type definition from comments');
            }
            paramTemplate.convertToArray = isArray;
            paramTemplate.typeDefinition = typeDef
            parameters.push(paramTemplate);
        }
    }
    return parameters;
}