import { ReferenceOptions } from 'component.reference';
import { Properties, Reference, TypeOptions } from '../registry.mjs';
class TypeAssociation extends Reference {
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
     * @returns { Array<{ type: Type, associateType: Type }> }
    */
    get() {
        return super.get();
    }
    /**
     * @param { Type } type
     * @param { Type } associateType
    */
    set(type, associateType) {
        const associations = super.get();
        associations.push({ type, associateType });
    }
}
export class Type extends Properties {
    /**
     * @param { TypeOptions } options
     * @returns { Type }
    */
    constructor(options = new TypeOptions()) {
        let target = new.target;
        if (target === Type) {
            throw new Error(`${Type.name} is an abstract class`);
        }
        if (options !== null && options !== undefined && !(options instanceof TypeOptions)) {
            throw new Error(`options argument is not of type ${TypeOptions.name}`);
        }
        super(options);
    }
    /**
     * @param { Type } type
    */
    associate(type) {
        const typeAssociations = new TypeAssociation();
        typeAssociations.set(this, type);
    }
    /**
     * @return { Array<Type> }
    */
    associations() {
        const typeAssociations = new TypeAssociation();
        return typeAssociations.get()
            .filter(x => x.type === this)
            .map(x => x.associateType);
    }
}