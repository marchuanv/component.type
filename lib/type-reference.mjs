import {
    PropertiesReference,
    Reflection,
    TypeAssociation,
    TypeReferenceContext
} from '../registry.mjs';
export class TypeReference extends PropertiesReference {
    /**
     * @param { TypeReferenceContext } context
    */
    constructor(context) {
        if (new.target === TypeReference) {
            throw new Error(`${TypeReference.name} is a a sealed class.`);
        }
        if (context === null || context === undefined || !(context instanceof TypeReferenceContext)) {
            throw new Error(`The context argument is null, undefined or not a ${TypeReferenceContext.name} type.`);
        }
        super(context);
    }
    /**
     * @returns { Array<class> }
    */
    get extended() {
        return super.extended.filter(x => x !== Type);
    }
    /**
     * @param { class | TypeReference } associatedType
    */
    associate(associateTypeRef) {
        if (associateTypeRef === null || associateTypeRef === undefined) {
            throw new Error(`The associateTypeRef argument is null or undefined.`);
        }
        const targetClass = super.targetClass;
        if (associateTypeRef instanceof TypeReference) {
            TypeAssociation.associate(targetClass, associateTypeRef.targetClass);
            TypeAssociation.associate(associateTypeRef.targetClass, targetClass);
        } else if (Reflection.isClass(associateTypeRef)) {
            TypeAssociation.associate(targetClass, associateTypeRef);
            TypeAssociation.associate(associateTypeRef, targetClass);
        } else {
            throw new Error(`The associateTypeRef argument is not a class or ${TypeReference.name}`);
        }
    }
    /**
     * @return { Array<class> } array of types
    */
    get associations() {
        return TypeAssociation.find(super.targetClass);
    }
}