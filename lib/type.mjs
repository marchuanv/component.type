import { GUID, Namespace } from '../registry.mjs';
const privateBag = new WeakMap();
const unlockId = new GUID({ description: 'this services a guid to indicate if a constructor should not finish creating a Type' });
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
        // Check if the target argument is provided and is a function
        if (!target || typeof target !== 'function' || !target.prototype) {
            throw new Error('The target argument is not a valid constructor function');
        }
        // Additional checks for ensuring the target is a class constructor
        if (target.prototype.constructor !== target) {
            throw new Error('The target argument is not a valid class constructor');
        }
        // Check if the provided namespace is a string
        if (typeof namespace !== 'string') {
            throw new Error('The namespace argument must be a string');
        }
        const namespaceString = (new Namespace(namespace)).toString();
        const type = target.toString();
        const typeName = target.name;
        const Id = new GUID({ Id: namespaceString, type, typeName });
        if (privateBag.has(Id)) {
            return privateBag.get(Id);
        }
        if (privateBag.has(unlockId)) {
            privateBag.set(Id, this);
            privateBag.set(this, { Id, target, namespace });
            privateBag.get(Type).push({ namespace, type: target })
        }
    }
    toString() {
        return this.Id.toString();
    }
    /**
     * @returns { class }
    */
    get type() {
        const { target } = privateBag.get(this);
        return target;
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        const { Id } = privateBag.get(this);
        return Id;
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
new Type('component', String);
new Type('component', Boolean);
new Type('component', BigInt);
new Type('component', Number);
new Type('component', Object);
new Type('component', Array);
new Type('component', GUID);
new Type('component', Namespace);
new Type('component', Type);