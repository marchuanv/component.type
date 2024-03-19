import {
    PropertiesReference,
    Reflection,
    TypeReferenceContext,
    TypeRegisterEntry
} from '../registry.mjs';
export class TypeReference extends PropertiesReference {
    /**
     * @param { TypeReferenceContext } context
    */
    constructor(context = null) {
        const targetClass = new.target;
        if (targetClass === TypeReference) {
            throw new Error(`${TypeReference.name} is an abstract class.`);
        }
        let _context = context;
        if (_context !== null && _context !== undefined && !(_context instanceof TypeReferenceContext)) {
            throw new Error(`The context argument is not a ${TypeReferenceContext.name}.`);
        }
        if (_context === undefined || _context === null) {
            _context = new TypeReferenceContext(new TypeRegisterEntry(targetClass));
        }
        super(context);
    }
    /**
     * @returns { Array<class> }
    */
    get extended() {
        return super.extended.filter(x => x !== TypeReference);
    }
    /**
     * @param { class | TypeReference } associatedType
    */
    associate(associateTypeRef) {
        if (associateTypeRef === null || associateTypeRef === undefined) {
            throw new Error(`The associateTypeRef argument is null or undefined.`);
        }
        const targetClass = super.targetClass;
        let associatedTargetClass = null;
        if (associateTypeRef instanceof TypeReference) {
            associatedTargetClass = associateTypeRef.targetClass;
        } else if (Reflection.isClass(associateTypeRef)) {
            associatedTargetClass = associateTypeRef;
        } else {
            throw new Error(`The associateTypeRef argument is not a class or ${TypeReference.name}`);
        }
        const typeRegisterEntry = new TypeRegisterEntry(targetClass, []);
        const assoctypeRegisterEntry = new TypeRegisterEntry(associatedTargetClass, []);
        const thisTypeRegStore = typeRegisterEntry.get();
        const associatedTypeRegStore = assoctypeRegisterEntry.get();
        const stores = [thisTypeRegStore, associatedTypeRegStore];
        for (const store of stores) {
            const { associations } = store;
            associations[associatedTargetClass.name] = associatedTargetClass;
            associations[targetClass.name] = targetClass;
        }
    }
    /**
     * @return { Array<class> } array of types
    */
    get associations() {
        const typeRegisterEntry = new TypeRegisterEntry(super.targetClass, []);
        const thisTypeRegStore = typeRegisterEntry.get();
        return Object.keys(thisTypeRegStore.associations).map(key => thisTypeRegStore.associations[key]);
    }
}