import { PropertiesReferenceContext, ReferenceId, TypeRegisterEntry } from '../registry.mjs';
export class TypeReferenceContext extends PropertiesReferenceContext {
    /**
     * @param { TypeRegisterEntry } typeRegisterEntry
     * @param { Boolean } singleton
     * @param { ReferenceId } refId
    */
    constructor(typeRegisterEntry, singleton = false, refId = new ReferenceId()) {
        super(typeRegisterEntry, singleton, refId);
    }
    /**
     * @returns { Array<class> }
    */
     get extended() {
        return super.extended.filter(x => x !== TypeReferenceContext);
    }
    /**
     * @returns { { Id: ReferenceId, singleton: Boolean, typeRegister: TypeRegisterEntry } }
    */
    get() {
        return super.get();
    }
    set() {
        throw new Error(`can't change reference context.`);
    }
}