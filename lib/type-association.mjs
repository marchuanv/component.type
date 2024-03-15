import { Reference, ReferenceContext } from '../registry.mjs';
export class TypeAssociation extends Reference {
    /**
     * @param { class } Class
     * @param { class } associatedClass
    */
    static associate(Class, associatedClass) {
        const typeAssociation = new TypeAssociation(new ReferenceContext(TypeAssociation, true));
        let associations = typeAssociation.get();
        if (!associations) {
            associations = {};
            typeAssociation.set(associations);
        }
        let _associations = null;
        if (associations[Class.name] === null || associations[Class.name] === undefined) {
            _associations = { Class };
            associations[Class.name] = _associations;
        }
        if (associations[Class.name][associatedClass.name] === null || associations[Class.name][associatedClass.name] === undefined) {
            associations[Class.name][associatedClass.name] = associatedClass;
        }
    }
    /**
     * @param { class } Class
     * @returns { Array<class> } Array of Classes
    */
    static find(Class) {
        const typeAssociation = new TypeAssociation(new ReferenceContext(TypeAssociation, true));
        const associations = typeAssociation.get();
        if (associations) {
            return Object.keys(associations).filter(key => key === Class.name).reduce((found, key1) => {
                const _associations = associations[key1];
                const associatedClass = Object.keys(_associations).filter(key => key !== 'Class').map(key2 => _associations[key2]);
                return found.concat(associatedClass);
            }, []);
        } else {
            return [];
        }
    }
    get extended() {
        return super.extended.filter(x => x !== TypeRegistry);
    }
    /**
     * @returns { Object } associations of classes
    */
    get() {
        return super.get();
    }
    /**
     * @param { Object } associations
    */
    set(associations) {
        return super.set(associations);
    }
}