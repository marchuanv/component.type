import { Schema, TypeInfo } from '../registry.mjs';
export class TypeRegisterSchema extends Schema {
    /**
     * @param { Array<{ name: String, typeInfo: TypeInfo }> } properties
    */
    constructor(properties = []) {
        super(properties.concat([{
            name: 'typeInfo',
            typeInfo: new TypeInfo({ type: TypeInfo })
        }]));
    }
}