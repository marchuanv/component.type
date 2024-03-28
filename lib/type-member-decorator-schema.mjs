import { Schema, TypeDecoratorAttributes, TypeInfo, TypeMemberInfo } from '../registry.mjs';
export class TypeMemberDecoratorSchema extends Schema {
    /**
     * @param { Array<{ name: String, typeInfo: TypeInfo }> } properties
    */
    constructor(properties = []) {
        super(properties.concat([
            { name: 'member', typeInfo: new TypeInfo({ type: TypeMemberInfo }) },
            { name: 'attributes', typeInfo: new TypeInfo({ type: TypeDecoratorAttributes }) }
        ]));
    }
}