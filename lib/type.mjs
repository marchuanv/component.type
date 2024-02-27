import { GUID, Namespace, PropertyRegEx, TypeOptions } from '../registry.mjs';
export class Type extends Namespace{
    /**
     * @param { class } target
     * @param { TypeOptions } options
     * @returns { Type }
    */
    constructor(target, options = null) {
        const targetClass = new.target;
        if (targetClass === Type) {
            throw new Error(`${Type.name} is an abstract class`);
        }
        if (options !== null && options !== undefined && !(options instanceof TypeOptions)) {
            throw new Error(`options argument is not of type ${TypeOptions.name}`);
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
        let namespaceStr = Type.namespace.toLowerCase();
        namespaceStr = `${namespaceStr}.${typeNameLowerCase}`;
        super(namespaceStr);
        Object.freeze(this);
        if (options) {
            const { getterRegEx, setterRegEx, propertyTypeRegEx } = options;
            const propertyDescriptors = Reflect.ownKeys(Class.prototype)
                .map(key => Reflect.getOwnPropertyDescriptor(Class.prototype, key))
                .filter(desc => desc);
            const propGetters = propertyDescriptors
                .filter(descriptor => descriptor.get && descriptor.get.toString().indexOf('[native code]') === -1)
                .map(descriptor => getPropertyMetadata(getterRegEx, propertyTypeRegEx, descriptor.get))
                .filter(propMetadata => propMetadata);
            const propSetters = propertyDescriptors
                .filter(descriptor => descriptor.set && descriptor.set.toString().indexOf('[native code]') === -1)
                .map(descriptor => getPropertyMetadata(setterRegEx, propertyTypeRegEx, descriptor.set))
                .filter(propMetadata => propMetadata);
            const propMetadata = propGetters.concat(propSetters);
            super.set({ name: 'propertyMetadata' }, propMetadata);
        }
        const existingType = super.get({ name: 'type' });
        if (existingType && existingType.prototype) {
            const existingTypeStr = existingType.toString().replace(/\s/g,'');
            const classStr = Class.toString().replace(/\s/g,'');
            if (existingTypeStr !== classStr) {
                throw new Error(`${typeName} already exists.`);
            }
        }
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
     * @returns { Array<{ propertyName: String, typeName: String, isGetter: Boolean, isSetter: Boolean }> }
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
/**
 * @param { PropertyRegEx } propertyRegEx
 * @param { PropertyRegEx } propertyTypeRegEx
 * @param { Function } getterSetterMethod 
 * @returns { { propertyName: String, typeName: String, isGetter: Boolean, isSetter: Boolean } }
 */
function getPropertyMetadata(propertyRegEx, propertyTypeRegEx, getterSetterMethod) {
    const propertyName = getterSetterMethod.name.replace(/\s/g, '').replace('get','').replace('set','');
    const isGetter = getterSetterMethod.name.startsWith('get');
    const isSetter = getterSetterMethod.name.startsWith('set');
    const _script = getterSetterMethod.toString().replace(/\s/g, '');
    const match = propertyRegEx.get(_script);
    const typeName = propertyTypeRegEx.get(match);
    return { propertyName, typeName, isGetter, isSetter };
}