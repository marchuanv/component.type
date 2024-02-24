import { GUID, Namespace } from '../registry.mjs';
class TypeSearch extends Type {
    /**
     * @param { String } namespace
     * @param { class } target
     * @returns { TypeSearch }
    */
    constructor(typeName, target) {
        const typeNameLowerCase = typeName.toLowerCase();
        const namespace = `${Type.namespace}.${typeNameLowerCase}`;
        super(namespace, target);
    }
}
export class Type extends Namespace{
    /**
     * @param { String } namespace
     * @param { class } target
     * @returns { Type }
    */
    constructor(namespace, target) {
        const targetClass = new.target;
        if (targetClass !== Type) {
            throw new Error(`${Type.name} is a sealed class`);
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
     * @returns { TypeSearch }
    */
    static get(criteria) {
        const { typeName } = criteria;
        const search = new TypeSearch(typeName);
        if (all.length === 0) {
            throw new Error(`type was not found for criteria: ${JSON.stringify(criteria)}`);
        } else if (all.length === 1) {
            const [{ namespace, type: Class }] = all;
            privateBag.delete(unlockId);
            const type = new Type(namespace, Class);
            privateBag.set(unlockId);
            if (privateBag.has(type)) {
                return type;
            } else {
                throw new Error(`type not found: ${JSON.stringify({ namespace, Class: Class.name })}`);
            }
        } else {
            throw new Error(`more than one type was found for criteria: ${JSON.stringify(criteria)}`);
        }
    }
    /**
     * check if a type exists.
     * @param { String } namespace
     * @param { class } target
     * @returns { Boolean }
    */
    static has(namespace, typeName) {
        return privateBag.get(Type).find(info =>
            (typeName && info.type.name === typeName) && (namespace && info.namespace === namespace)
        ) !== undefined;
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