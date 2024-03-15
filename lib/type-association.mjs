import { Reference, ReferenceOptions, Type } from '../registry.mjs';
export class TypeAssociation extends Reference {
    constructor() {
        let target = new.target;
        if (target !== TypeAssociation) {
            throw new Error(`${TypeAssociation.name} is a sealed class`);
        }
        const options = new ReferenceOptions();
        options.isSingleton = true;
        super(options);
        if (!super.get()) {
            super.set([]);
        }
    }
    /**
     * @returns { Array<{ type: class, associateType: class }> }
    */
    get() {
        return super.get();
    }
    /**
     * @param { Type | class } type
     * @param { Type | class } associateType
    */
    set(type, associateType) {
        const associations = super.get();
        let typeTargetClass = null;
        let associateTypeTargetClass = null;
        if (type instanceof Type) {
            typeTargetClass = type.targetClass;
        }
        if (associateType instanceof Type) {
            associateTypeTargetClass = associateType.targetClass;
        }
        associations.push({
            type: typeTargetClass,
            associateType: associateTypeTargetClass
        });
    }
}