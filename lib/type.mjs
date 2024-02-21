import { GUID, Namespace } from '../registry.mjs';
const privateBag = new WeakMap();
let lock = false;
export class Type {
    /**
     * @param { String } namespace
     * @param { class } target
     * @returns { Type }
    */
    constructor(namespace, target) {
        Object.freeze(this);
        if (!target) {
            throw new Error('The target argument is null or undefined.');
        }
        if (typeof target !== 'function') {
            throw new Error('The target argument is not an object');
        }
        if (!target.constructor) {
            throw new Error('The target argument is not a class');
        }
        namespace = (new Namespace(namespace)).toString();
        const type = target.toString();
        const typeName = target.name;
        const Id = new GUID({ namespace, type, typeName });
        if (privateBag.has(Id)) {
            return privateBag.get(Id);
        } else {
            if (!lock) {
                privateBag.set(Id, this);
            }
        }
        if (!lock) {
            privateBag.set(this, Id);
        }
    }
    toString() {
        return privateBag.get(this).toString();
    }
    /**
     * gets a reference based on the criteria.
     * @param { String } namespace - The namespace string for the reference.
     * @param { class } target - The target class
     * @returns { Type }
    */
    static get(namespace, target) {
        lock = true;
        const type = new Type(namespace, target);
        lock = false;
        if (privateBag.has(type)) {
            return type;
        } else {
            throw new Error(`type not found: ${JSON.stringify({ namespace, Class: target.name })}`);
        }
    }
}
new Type('common', String);
new Type('common', Boolean);
new Type('common', BigInt);
new Type('common', Number);
new Type('common', Object);
new Type('common', Array);
new Type('component.uuid', GUID);
new Type('component.namespace', Namespace);
new Type('component.type', Type);