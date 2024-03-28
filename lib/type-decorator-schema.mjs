import { TypeInfo, TypeRegisterSchema } from '../registry.mjs';
export class TypeDecoratorSchema extends TypeRegisterSchema {
    /**
     * @param { Array<{ name: String, typeInfo: TypeInfo }> } properties
    */
    constructor(properties = []) {
        super(properties.concat([
            { name: 'memberDecorators', typeInfo: new TypeInfo({ type: Array }) }
        ]));
    }
}