import { GUID, Namespace } from '../registry.mjs';
export class Type extends Namespace{
    /**
     * @param { class } target
     * @returns { Type }
    */
    constructor(target) {
        const targetClass = new.target;
        if (targetClass === Type) {
            throw new Error(`${Type.name} is an abstract class`);
        }
        let Class = null;
        if (typeof target === 'function' && target.prototype) {
            Class = target;
        } else if (typeof target === 'object' && target.constructor && target.constructor.toString().startsWith('class')) {
            Class = target.constructor;
        } else {
            throw new Error('target argument must be a class or an object');
        }
        const propGetters = Reflect.ownKeys(Class.prototype)
            .map(key => Reflect.getOwnPropertyDescriptor(Class.prototype, key))
            .filter(p => p.get)
            .map(p => p.get);
        const propSetters = Reflect.ownKeys(Class.prototype)
            .map(key => Reflect.getOwnPropertyDescriptor(Class.prototype, key))
            .filter(p => p.set)
            .map(p => p.set);
        const propMetadata = propGetters.concat(propSetters);
        const typeName = Class.name;
        const typeNameLowerCase = typeName.toLowerCase();
        let namespaceStr = Type.namespace.toLowerCase();
        namespaceStr = `${namespaceStr}.${typeNameLowerCase}`;
        super(namespaceStr);
        Object.freeze(this);
        const existingType = super.get({ name: 'type' });
        if (existingType && existingType.prototype) {
            if (existingType.toString() !== Class.toString()) {
                throw new Error(`${typeName} already exists.`);
            }
        }
        super.set({ name: 'typeName' }, typeName);
        super.set({ name: 'type' }, Class);
        super.set({ name: 'propertyMetadata' }, propMetadata);
    }
    /**
     * @returns { String }
    */
    toString() {
        const namespace = super.toString();
        const type = super.get({ namespace });
        return JSON.stringify({
            namespace,
            type
        });
    }
    /**
     * @returns { String }
    */
    get name() {
        return super.get({ name: 'typeName' });
    }
    /**
     * @returns { class }
    */
    get type() {
        return super.get({ name: 'type' });
    }
    /**
     * @returns { Array }
    */
    get propertyMetadata() {
        return super.get({ name: 'propertyMetadata' });
    }
    /**
     * @returns { String }
    */
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
class CommonType extends Type {}
new CommonType(String);
new CommonType(Boolean);
new CommonType(BigInt);
new CommonType(Number);
new CommonType(Object);
new CommonType(Array);
new CommonType(GUID);
new CommonType(Namespace);
new CommonType(Set);