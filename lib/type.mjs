import { GUID, Namespace, Properties, TypeMetadata, TypeOptions } from '../registry.mjs';
class Types extends Namespace {
    constructor() {
        super('component.types');
    }
}
const types = new Types();
export class Type extends Properties {
    /**
     * @param { TypeOptions } options
     * @returns { Type }
    */
    constructor(options = new TypeOptions()) {
        let target = new.target;
        if (target === Type) {
            throw new Error(`${Type.name} is an abstract class`);
        }
        if (options !== null && options !== undefined && !(options instanceof TypeOptions)) {
            throw new Error(`options argument is not of type ${TypeOptions.name}`);
        }
        const typeMetadata = new TypeMetadata(target);
        const { type } = typeMetadata;
        const { name } = typeMetadata;
        if (!types.get({ name })) {
            types.set({ name }, type);
        }
        super(type, options);
        Object.freeze(this);
        super.set({ name: 'metadata', metadata: typeMetadata }, Object, false);
        super.set({ name: 'associations' }, Array, false);
    }
    /**
     * @returns { String }
    */
    toString() {
        const metadata = super.get({ name: 'metadata' }, Object, false);
        const { namespace } = JSON.parse(metadata.toString());
        const { type } = metadata;
        return JSON.stringify({ namespace, typeName: type.name });
    }
    /**
     * @returns { { name: String, type: class } }
    */
    get metadata() {
        return super.get({ name: 'metadata' }, Object, false);
    }
    /**
     * @param { Type } type
    */
    associate(type) {
        if (!(type instanceof Type)) {
            throw new Error(`the type argument is not of type: ${Type.name}`);
        }
        const associations = super.get({ name: 'associations' }, Object, false);
        associations.push(type);
    }
    /**
     * @return { Array<Type> }
    */
    get associations() {
        return super.get({ name: 'associations' }, Object, false);
    }
    /**
     * gets a type provided the typeName.
     * @param { String } typeName
     * @returns { class }
    */
    static get(typeName) {
        if (Type.has(typeName)) {
            return types.get({ name: typeName });
        }
        throw new Error(`${typeName} was not found.`);
    }
    /**
     * check if a type exists.
     * @param { String } typeName
     * @returns { Boolean }
    */
    static has(typeName) {
        if (typeName === undefined || typeName === null || (typeName && typeof typeName !== 'string')) {
            throw new Error('The typeName argument is null, undefined, or not a string');
        }
        const type = types.get({ name: typeName });
        if (type) {
            return true;
        }
        return false
    }
}
types.set({ name: 'String' }, String);
types.set({ name: 'Boolean' }, Boolean);
types.set({ name: 'BigInt' }, BigInt);
types.set({ name: 'Number' }, Number);
types.set({ name: 'Object' }, Object);
types.set({ name: 'Array' }, Array);
types.set({ name: 'GUID' }, GUID);
types.set({ name: 'Namespace' }, Namespace);
types.set({ name: 'Set' }, Set);