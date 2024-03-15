import { Properties, TypeAssociation, TypeOptions } from '../registry.mjs';
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
     * @returns { Array<class> }
    */
    get extended() {
        return super.extended.filter(x => x !== Type);
    }
    /**
     * @param { Type | class } type
    */
    associate(type) {
        const typeAssociations = new TypeAssociation();
        typeAssociations.set(this, type);
    }
    /**
     * @return { Array<class> }
    */
    get associations() {
        const typeAssociations = new TypeAssociation();
        return typeAssociations.get()
            .filter(x => x.type === this.targetClass)
            .map(x => x.associateType);
    }
}