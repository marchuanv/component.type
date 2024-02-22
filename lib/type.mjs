import { GUID, Namespace } from '../registry.mjs';
const privateBag = new WeakMap();
const unlockId = new GUID({ description: 'this guid is to indicate if a constructor should finish creating a Type' });
privateBag.set(unlockId);
export class Type {
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
        Object.freeze(this);
        let Class = null;
        if (typeof target === 'function' && target.prototype) {
            Class = target;
        } else if (typeof target === 'object' && target.constructor && target.constructor.toString().startsWith('class')) {
            Class = target.constructor;
        } else {
            throw new Error('target argument must be a class or an object');
        }
        let typeName = Class.name;
        const namespaceString = (new Namespace(namespace)).toString();
        const classStr = Class.toString();
        const Id = new GUID({ Id: namespaceString, type: classStr, typeName });
        if (privateBag.has(Id)) {
            return privateBag.get(Id);
        }
        if (privateBag.has(unlockId)) {
            privateBag.set(Id, this);
            privateBag.set(this, { Id, Class, namespace, name: typeName });
            privateBag.get(Type).push({ namespace, type: Class });
        }
    }
    toString() {
        return this.Id.toString();
    }
    /**
     * @returns { String }
    */
    get name() {
        const { name } = privateBag.get(this);
        return name;
    }
    /**
     * @returns { class }
    */
    get type() {
        const { Class } = privateBag.get(this);
        return Class;
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
    static get namespace() {
        return 'component';
    }
    /**
     * gets a type based on the criteria.
     * @param { { namespace: String, typeName: String } } criteria
     * @returns { Type }
    */
    static get(criteria) {
        const { namespace, typeName } = criteria;
        const all = privateBag.get(Type).filter(info =>
            (typeName && info.type.name === typeName) ||
            (namespace && info.namespace === namespace)
        );
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
privateBag.set(Type, []);
new Type(Type.namespace, String);
new Type(Type.namespace, Boolean);
new Type(Type.namespace, BigInt);
new Type(Type.namespace, Number);
new Type(Type.namespace, Object);
new Type(Type.namespace, Array);
new Type(Type.namespace, GUID);
new Type(Type.namespace, Namespace);
new Type(Type.namespace, Type);
new Type(Type.namespace, Set);