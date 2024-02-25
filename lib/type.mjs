import { GUID, Namespace } from '../registry.mjs';
export class Type extends Namespace{
    /**
     * @param { String } namespace
     * @param { class } target
     * @returns { Type }
    */
    constructor(namespace, target) {
        const targetClass = new.target;
        if (targetClass === Type) {
            throw new Error(`${Type.name} is an abstract class`);
        }
        // Validate namespace argument
        if (namespace === undefined || namespace === null || (namespace && typeof namespace !== 'string')) {
            throw new Error('The namespace argument is null, undefined, or not a string');
        }
        let Class = null;
        if (typeof target === 'function' && target.prototype) {
            Class = target;
        } else if (typeof target === 'object' && target.constructor && target.constructor.toString().startsWith('class')) {
            Class = target.constructor;
        } else {
            throw new Error('target argument must be a class or an object');
        }
        const typeName = Class.name;
        const typeNameLowerCase = typeName.toLowerCase();
        let namespaceStr = namespace.toLowerCase();
        if (namespaceStr.indexOf(typeNameLowerCase) > -1) {
            throw new Error('type name is not allowed in the namespace');
        }
        namespaceStr = `${namespaceStr}.${typeNameLowerCase}`;
        super(namespaceStr);
        Object.freeze(this);
        super.set({ name: 'typeName' }, typeName);
        super.set({ name: 'type' }, Class);
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
new Type(Type.namespace, String);
new Type(Type.namespace, Boolean);
new Type(Type.namespace, BigInt);
new Type(Type.namespace, Number);
new Type(Type.namespace, Object);
new Type(Type.namespace, Array);
new Type(Type.namespace, GUID);
new Type(Type.namespace, Namespace);
new Type(Type.namespace, Set);