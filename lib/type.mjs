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
        const targetClass = new.target;
        if (targetClass !== Type) {
            throw new Error(`${Type.name} is a sealed class`);
        }
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
        const _namespace = (new Namespace(namespace)).toString();
        const type = target.toString();
        const typeName = target.name;
        const Id = new GUID({ Id: _namespace, type, typeName });
        if (privateBag.has(Id)) {
            return privateBag.get(Id);
        }
        if (!lock) {
            privateBag.set(Id, this);
            privateBag.set(this, { Id, target, namespace });
            privateBag.get(Type).push({ namespace, type: target })
        }
    }
    toString() {
        const { Id } = privateBag.get(this);
        return Id.toString();
    }
    get type() {
        const { target } = privateBag.get(this);
        return target;
    }
    /**
     * gets a reference based on the criteria.
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
            lock = true;
            const type = new Type(namespace, Class);
            lock = false;
            if (privateBag.has(type)) {
                return type;
            } else {
                throw new Error(`type not found: ${JSON.stringify({ namespace, Class: Class.name })}`);
            }
        } else {
            throw new Error(`more than one type was found for criteria: ${JSON.stringify(criteria)}`);
        }
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