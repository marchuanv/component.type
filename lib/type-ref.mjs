import { Reference } from "./reference.mjs";
/**
 * Represents a type reference with a unique identifier, associated references, and a type name.
 * @extends Reference
 */
export class TypeReference extends Reference {
    /**
     * Creates an instance of TypeReference.
     * @param { string } namespace - The namespace string for the reference.
     * @param { string } typeName - The name of the type.
     * @throws { Error } Throws an error if the namespace or typeName is null, undefined, empty, or not a string, or if a type with the same name already exists.
     */
    constructor(namespace, typeName) {
        if (!namespace) {
            throw new Error('The namespace argument is null, undefined, or empty.');
        }
        if (typeof namespace !== 'string') {
            throw new Error('The namespace argument is not a string.');
        }
        if (!typeName) {
            throw new Error('The typeName argument is null, undefined, or empty.');
        }
        if (typeof typeName !== 'string') {
            throw new Error('The typeName argument is not a string.');
        }
        if (Reference.find({ typeName })) {
            throw new Error(`The '${typeName}' type already exists in the metadata.`);
        }
        super(namespace);
        this.metadata.typeName = typeName;
    }

    /**
     * Returns the type name of the TypeReference.
     * @returns {string} The type name.
     */
    toString() {
        return this.metadata.typeName;
    }
}