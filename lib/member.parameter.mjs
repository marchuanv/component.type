import {
    GUID,
    TypeDefinition
} from '../registry.mjs';
const privateBag = new WeakMap();
export class MemberParameter {
    /**
     * @param { Object } field
     * @param { Object } typeRef
     * @param { Boolean } convertToArray
    */
    constructor(field, typeRef, convertToArray) {
        const key = Object.keys(field)[0];
        const value = field[key];
        const typeDef = TypeDefinition.find({
            typeName: typeRef,
            type: typeRef,
            Id: typeRef
        });
        if (!typeDef) {
            throw new Error(`could not find type: ${typeRef.name}`);
        }
        privateBag.set(this, {
            Id: new GUID(),
            name: key,
            value,
            typeDefinition: typeDef,
            convertToArray
        });
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        const { Id } = privateBag.get(this);
        return Id;
    }
    /**
     * @returns { String }
    */
    get name() {
        const { name } = privateBag.get(this);
        return name;
    }
    /**
     * @returns { Object }
    */
    get value() {
        const { value } = privateBag.get(this);
        return value;
    }
    /**
     * @param { Object } value
    */
    set value(value) {
        privateBag.get(this).value = value;
    }
    /**
     * @returns { TypeDefinition }
    */
    get typeDefinition() {
        const { typeDefinition } = privateBag.get(this);
        return typeDefinition;
    }
    /**
     * @returns { Boolean }
    */
    get convertToArray() {
        const { convertToArray } = privateBag.get(this);
        return convertToArray;
    }
}