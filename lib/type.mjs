import { GUID, Namespace } from '../registry.mjs';
const privateBag = new WeakMap();
export class Type {
    /**
     * @param { String } namespace
     * @param { class } target
    */
    constructor(namespace, target) {
        if (!target) {
            throw new Error('The target argument is null or undefined.');
        }
        if (typeof target !== 'function') {
            throw new Error('The target argument is not an object');
        }
        if (!target.constructor) {
            throw new Error('The target argument is not a class');
        }
        const ns = new Namespace(namespace);
        const type = target.toString();
        const Id = new GUID({ namespace, type });
        if (privateBag.has(Id)) {
            return privateBag.get(Id);
        } else {
            privateBag.set(Id, this);
        }
        privateBag.set(this, Id);
    }
    toString() {
        return privateBag.get(this).toString();
    }
}