import {
    GUID,
    MemberParameter,
    existsSync,
    fileURLToPath,
    join,
    readFileSync,
    walkDir
} from "../registry.mjs";
const privateBag = new WeakMap();
const typeDefinitions = [];
export class TypeDefinition {
    /**
     * @param { GUID } Id
     * @param { Boolean } convertToArray
    */
    constructor(Id, convertToArray) {
        const found = TypeDefinition.find({ Id: Id.toString() });
        if (!found) {
            throw new Error(`${typeDefinitionFilePath} does not have a type with Id: ${Id}`);
        }
        const { name, typeName, isReferenceType, type, isArray, scriptFilePath } = found;
        if (convertToArray) {
            {
                const _name = name;
                const _typeName = typeName;
                const _type = type;
                const { Id } = TypeDefinition.find({ name: 'array' });
                const arrayDefintion = new TypeDefinition(new GUID(Id), false);
                privateBag.set(this, {
                    name: `array<${_name}>`,
                    typeName: `Array<${_typeName}>`,
                    Id: arrayDefintion.Id,
                    type: [_type, arrayDefintion.type],
                    isReferenceType: true,
                    isArray: true,
                    scriptFilePath
                });
            }
        } else {
            privateBag.set(this, {
                name,
                typeName,
                Id,
                type,
                isReferenceType,
                isArray,
                scriptFilePath
            });
        }
        const index = TypeDefinition.findIndex({ Id: Id.toString() });
        typeDefinitions[index] = this;
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        const { Id } = privateBag.get(this);
        return Id;
    }
    /**
     * @returns { String }
    */
    get name() {
        const { name } = privateBag.get(this);
        return name;
    }
    /**
     * @returns { String }
    */
    get typeName() {
        const { typeName } = privateBag.get(this);
        return typeName;
    }
    /**
     * @returns { Object }
    */
    get type() {
        const { type } = privateBag.get(this);
        return type;
    }
    /**
     * @returns { Boolean }
    */
    get isArray() {
        const { isArray } = privateBag.get(this);
        return isArray;
    }
    /**
     * @returns { Boolean }
    */
    get isReferenceType() {
        const { isReferenceType } = privateBag.get(this);
        return isReferenceType;
    }
    /**
     * @returns { Boolean }
    */
    get isObject() {
        return this.type === Object;
    }
    /**
     * @returns { String }
    */
    get scriptFilePath() {
        const { scriptFilePath } = privateBag.get(this);
        return scriptFilePath;
    }
    /**
     * @returns { String }
    */
    toString() {
        const { name } = privateBag.get(this);
        return name;
    }
    /**
     * @param { { name: String, typeName: String, Id: String, isReferenceType: Boolean, type: class } } criteria
     * @returns { TypeDefinition }
    */
    static find(criteria) {
        const { name, typeName, Id, isReferenceType, type } = criteria;
        const results = TypeDefinition.types.filter(def =>
            (name && def.name === name) ||
            (typeName && def.typeName === typeName) ||
            (Id && (def.Id === Id || def.Id.toString() === Id || def.Id === Id.toString() || def.Id.toString() === Id.toString())) ||
            (isReferenceType !== undefined && def.isReferenceType === isReferenceType) ||
            (type && def.type === type)
        );
        if (results.length > 0) {
            if (results.length === 1) {
                return results[0];
            }
            return results;
        } else {
            return null;
        }
    }
    /**
     * @param { { name: String, typeName: String, Id: String, isReferenceType: Boolean, type: class } } criteria
     * @returns { Number }
    */
    static findIndex(criteria) {
        const { name, typeName, Id, isReferenceType, type } = criteria;
        return TypeDefinition.types.findIndex(def => def !== undefined && (
            (name && def.name === name) ||
            (typeName && def.typeName === typeName) ||
            (Id && (def.Id === Id || def.Id.toString() === Id || def.Id === Id.toString() || def.Id.toString() === Id.toString())) ||
            (isReferenceType !== undefined && def.isReferenceType === isReferenceType) ||
            (type && def.type === type)
        ));
    }
    /**
     * @param { String } classInterfaceConfigFilePath
     * @param { class } targetClass
    */
    static createClass(classInterfaceConfigFilePath, targetClass) {
        if (!existsSync(classInterfaceConfigFilePath)) {
            throw new Error(`${classInterfaceConfigFilePath} not found`);
        }
        const atIndex = TypeDefinition.types.findIndex(x => x.typeName === targetClass.name);
        if (atIndex > -1) {
            typeDefinitions.splice(atIndex, 1);
        }
        const typeDefConfig = JSON.parse(readFileSync(classInterfaceConfigFilePath, 'utf8'));
        typeDefConfig.ctor.typeDefinition.type = targetClass;
        typeDefConfig.ctor.typeDefinition.scriptFilePath = typeDefConfig.scriptFilePath;
        if (!typeDefConfig.ctor.typeDefinition) {
            throw new Error('no type definition for ctor');
        }
        typeDefinitions.push(typeDefConfig.ctor.typeDefinition);
        new TypeDefinition(typeDefConfig.Id, false);
    }
    /**
     * @returns { Array<{ Id: String, typeName }> }
    */
    static get types() {
        const _typeDefinitions = [];
        for (const typeDef of typeDefinitions) {
            _typeDefinitions.push(typeDef);
        }
        return _typeDefinitions;
    }
}
function mapType(name) {
    switch (name) {
        case 'string': {
            return String;
        }
        case 'number': {
            return Number;
        }
        case 'boolean': {
            return Boolean;
        }
        case 'bigint': {
            return BigInt;
        }
        case 'object': {
            return Object;
        }
        case 'symbol': {
            return Symbol;
        }
        case 'null': {
            return null;
        }
        case 'undefined': {
            return undefined;
        }
        case 'array': {
            return Array;
        }
        case 'guid': {
            return GUID;
        }
        case 'memberParameter': {
            return MemberParameter;
        }
        case 'function': {
            return Function;
        }
        default: {
            throw new Error('could not map type');
        }
    }
}
const currentDir = fileURLToPath(new URL('./', import.meta.url));
const definitionsDirPath = join(currentDir, 'definitions');
walkDir(definitionsDirPath, (filePath) => {
    if (filePath.endsWith('.definition.json')) {
        const typeDefConfig = JSON.parse(readFileSync(filePath, 'utf8'));
        typeDefConfig.type = mapType(typeDefConfig.name);
        typeDefConfig.scriptFilePath = filePath;
        typeDefinitions.push(typeDefConfig);
        new TypeDefinition(typeDefConfig.Id, false);
    }
});