import {
    PropertiesReference,
    TypeReferenceContext,
    TypeRegisterEntry
} from '../registry.mjs';
export class TypeCtorReference extends PropertiesReference {
    /**
     * @param { TypeReferenceContext } context
    */
    constructor(context = null) {
        const targetClass = new.target;
        if (targetClass === TypeCtorReference) {
            throw new Error(`${TypeCtorReference.name} is an abstract class.`);
        }
        let _context = context;
        if (_context !== null && _context !== undefined && !(_context instanceof TypeReferenceContext)) {
            throw new Error(`The context argument is not a ${TypeReferenceContext.name}.`);
        }
        if (_context === undefined || _context === null) {
            _context = new TypeReferenceContext(new TypeRegisterEntry(targetClass));
        }
        super(_context);
    }
    /**
     * @returns { Array<class> }
    */
    get extended() {
        return super.extended.filter(x => x !== TypeReference);
    }
}