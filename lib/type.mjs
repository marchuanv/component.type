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
        TypeRegistry.register(target, false, refId);
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
        let _associatedType = associatedType;
        if (!(_associatedType instanceof Type)) {
            if (Reflection.isClass(associatedType)) {
                _associatedType = TypeRegistry.find({ name: associatedType.name });
            } else {
                throw new Error(`The associatedType argument is not a class or ${Type.name}`);
            }
        }
        const targetClass = super.targetClass;
        TypeAssociation.associate(
            targetClass,
            associatedType.targetClass
        );
    }
    /**
     * @return { Array<class> } array of types
    */
    get associations() {
        return TypeAssociation.find(super.targetClass);
    }
}