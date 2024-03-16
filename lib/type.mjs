import {
    Properties,
    PropertiesContext,
    ReferenceId,
    Reflection,
    TypeAssociation,
    TypeRegistry
} from '../registry.mjs';
export class Type extends Properties {
    constructor() {
        let target = new.target;
        if (target === Type) {
            throw new Error(`${Type.name} is an abstract class`);
        }
        const refId = new ReferenceId();
        TypeRegistry.register(target);
        super(new PropertiesContext(target, false, refId));
    }
    /**
     * @returns { Array<class> }
    */
    get extended() {
        return super.extended.filter(x => x !== Type);
    }
    /**
     * @param { class | Type } associatedType
    */
    associate(associatedType) {
        if (associatedType === null || associatedType === undefined) {
            throw new Error(`The associatedType argument is null or undefined.`);
        }
        const targetClass = super.targetClass;
        if (associatedType instanceof Type) {
            TypeAssociation.associate(targetClass, associatedType.targetClass);
            TypeAssociation.associate(associatedType.targetClass, targetClass);
        } else if (Reflection.isClass(associatedType)) {
            TypeAssociation.associate(targetClass, associatedType);
            TypeAssociation.associate(associatedType, targetClass);
        } else {
            throw new Error(`The associatedType argument is not a class or ${Type.name}`);
        }
    }
    /**
     * @return { Array<class> } array of types
    */
    get associations() {
        return TypeAssociation.find(super.targetClass);
    }
}