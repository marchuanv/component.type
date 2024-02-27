import { Namespace } from '../registry.mjs';
export class TypeMetadata extends Namespace {
    /**
     * @param { class | Object } target
     * @returns { Type }
    */
    constructor(target) {
        if (new.target !== TypeMetadata) {
            throw new Error(`${TypeMetadata.name} is a sealed class.`);
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
        let namespaceStr = TypeMetadata.namespace.toLowerCase();
        namespaceStr = `${namespaceStr}.${typeNameLowerCase}`;
        super(namespaceStr);
        Object.freeze(this);
        const existingType = super.get({ name: 'type' });
        if (existingType && existingType.prototype) {
            const existingTypeStr = existingType.toString().replace(/\s/g, '');
            const classStr = Class.toString().replace(/\s/g, '');
            if (existingTypeStr !== classStr) {
                throw new Error(`The ${typeName} class already exists.`);
            }
        }
        super.set({ name: 'typeName' }, typeName);
        super.set({ name: 'type' }, Class);
    }
    /**
     * @returns { String }
    */
    toString() {
        const { namespace } = JSON.parse(super.toString());
        const type = super.get({ name: 'type' });
        return JSON.stringify({ namespace, type });
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
        return 'component.types.metadata';
    }
}