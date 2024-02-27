import { GUID, Namespace, Properties, TypeMetadata, TypeOptions } from '../registry.mjs';
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
        if (target === CommonType) {
            target = CommonType.target;
        }
        if (options !== null && options !== undefined && !(options instanceof TypeOptions)) {
            throw new Error(`options argument is not of type ${TypeOptions.name}`);
        }
        const typeMetadata = new TypeMetadata(target);
        const { type } = typeMetadata;
        const { namespace } = JSON.parse(typeMetadata.toString());
        super(namespace.replace('.metadata.', '.'), type, options);
        Object.freeze(this);
        super.set({ name: 'metadata', metadata: typeMetadata }, Object, false);
    }
    /**
     * @returns { String }
    */
    toString() {
        const metadata = super.get({ name: 'metadata' }, Object, false);
        const { namespace } = JSON.parse(metadata.toString());
        const type = super.get({ namespace });
        return JSON.stringify({ namespace, type });
    }
    /**
     * @returns { { name: String, type: class } }
    */
    get metadata() {
        return super.get({ name: 'metadata' }, Object, false);
    }
    static get namespace() {
        return 'component.types';
    }
    /**
     * gets a type based on the typeName.
     * @param { String } typeName
     * @returns { class }
    */
    static get(typeName) {
        // Validate namespace argument
        if (typeName === undefined || typeName === null || (typeName && typeof typeName !== 'string')) {
            throw new Error('The typeName argument is null, undefined, or not a string');
        }
        const ns = Namespace.get(`${Type.namespace}.${typeName}`);
        const type = ns.get({ name: 'type' });
        const _typeName = ns.get({ name: 'typeName' });
        if (_typeName !== typeName || type === undefined || type === null) {
            throw new Error(`${typeName} was not found.`);
        }
        return type;
    }
    /**
     * check if a type exists.
     * @param { String } namespace
     * @returns { Boolean }
    */
    static has(typeName) {
        // Validate namespace argument
        if (typeName === undefined || typeName === null || (typeName && typeof typeName !== 'string')) {
            throw new Error('The typeName argument is null, undefined, or not a string');
        }
        const ns = Namespace.get(`${Type.namespace}.${typeName}`);
        const type = ns.get({ name: 'type' });
        const _typeName = ns.get({ name: 'typeName' });
        return _typeName === typeName && type !== undefined && type !== null;
    }
}
class CommonType extends Type {
    /**
     * @param { class } target
    */
    constructor(target) {
        CommonType.target = target;
        super();
    }
    static get target() {
        return this._target;
    }
    static set target(value) {
        this._target = value;
    }
}
new CommonType(String);
new CommonType(Boolean);
new CommonType(BigInt);
new CommonType(Number);
new CommonType(Object);
new CommonType(Array);
new CommonType(GUID);
new CommonType(Namespace);
new CommonType(Set);