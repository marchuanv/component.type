import { Reference, ReferenceContext, ReferenceId, Reflection } from '../registry.mjs';
class RegistryType extends Reference { }
export class TypeRegistry extends Reference {
    /**
     * @param { class } Class
     * @param { Boolean } singleton
     * @param { ReferenceId } refId
    */
    static register(Class, singleton, refId) {
        if (Class === null || Class === undefined || !Reflection.isClass(Class)) {
            throw new Error(`The Class argument is null or undefined or not a class.`);
        }
        if (singleton === null || singleton === undefined || typeof singleton !== 'boolean') {
            throw new Error(`The singleton argument is null or undefined or not a boolean.`);
        }
        if (refId === null || refId === undefined || !(refId instanceof ReferenceId)) {
            throw new Error(`The refId argument is null or undefined or not a ReferenceId.`);
        }
        const typeRegistry = new TypeRegistry(new ReferenceContext(TypeRegistry, true));
        let registry = typeRegistry.get();
        if (!registry) {
            registry = {};
            typeRegistry.set(registry);
        }
        if (registry[Class.name] === null || registry[Class.name] === undefined) {
            registry[Class.name] = {
                Class,
                singleton,
                refId
            };
        }
    }
    /**
     * @param { String } className
     * @returns { class } Class
    */
    static find(className) {
        if (className === null || className === undefined || typeof className !== 'string') {
            throw new Error(`The className argument is null or undefined or not a string.`);
        }
        if (className.replace(/\s/g, '') === '') {
            throw new Error(`The className argument is an empty string.`);
        }
        const typeRegistry = new TypeRegistry(new ReferenceContext(TypeRegistry, true));
        const registry = typeRegistry.get();
        if (!registry) {
            registry = {};
            typeRegistry.set(registry);
        }
        return registry[className];
    }
    get extended() {
        return super.extended.filter(x => x !== TypeRegistry);
    }
    /**
     * @returns { Object} registry for classes
    */
    get() {
        return super.get();
    }
    /**
     * @param { Object } registry
    */
    set(registry) {
        return super.set(registry);
    }
}