import { Reference, ReferenceContext, ReferenceId, Type } from '../registry.mjs';
class RegistryType extends Reference { }
export class TypeRegistry extends Reference {
    /**
     * @param { class } Class
     * @param { Boolean } singleton
     * @param { ReferenceId } refId
    */
    static register(Class, singleton, refId) {
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
     * @param { { name: String } } criteria
     * @returns { Type } Type Reference
    */
    static find(criteria) {
        const typeRegistry = new TypeRegistry(new ReferenceContext(TypeRegistry, true));
        const registry = typeRegistry.get();
        if (!registry) {
            registry = {};
            typeRegistry.set(registry);
        }
        const { name } = criteria;
        if (name) {
            const { Class, singleton, refId } = registry[name];
            return new RegistryType(new ReferenceContext(Class, singleton, refId));
        }
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