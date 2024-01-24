import {
    GUID,
    GenericType,
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
        const {
            name,
            typeName,
            isReferenceType,
            type,
            isArray,
            scriptFilePath,
            configFilePath,
            isNative
        } = found;
        const config = JSON.parse(readFileSync(configFilePath, 'utf8'));
        privateBag.set(this, {
            name,
            typeName,
            Id,
            type,
            isReferenceType,
            isArray,
            scriptFilePath,
            config,
            isNative
        });
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
    get isReferenceType() {
        const { isReferenceType } = privateBag.get(this);
        return isReferenceType;
    }
    /**
     * @returns { String }
    */
    get scriptFilePath() {
        const { scriptFilePath } = privateBag.get(this);
        return scriptFilePath;
    }
    /**
     * @returns { Object }
    */
    get config() {
        const { config } = privateBag.get(this);
        return config;
    }
    /**
     * @returns { Object }
    */
    get isNative() {
        const { isNative } = privateBag.get(this);
        return isNative;
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
            (type && def.type === type) ||
            (type !== undefined && def.type === type)
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
        typeDefConfig.ctor.typeDefinition.configFilePath = classInterfaceConfigFilePath;
        if (!typeDefConfig.ctor.typeDefinition) {
            throw new Error('no type definition for ctor');
        }
        Object.freeze(typeDefConfig);
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
        case 'T': {
            return GenericType;
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
        typeDefConfig.configFilePath = filePath;
        typeDefinitions.push(typeDefConfig);
        Object.freeze(typeDefConfig);
        new TypeDefinition(typeDefConfig.Id, false);
    }
});