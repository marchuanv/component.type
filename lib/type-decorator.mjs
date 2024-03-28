import { GUID, TypeDecoratorSchema, TypeInfo, TypeMemberDecorator, TypeRegister } from '../registry.mjs';
export class TypeDecorator extends TypeRegister {
    /**
     * @param { TypeInfo } typeInfo
     * @param { Array<TypeMemberDecorator> } memberDecorators
     * @param { GUID } typeDecoratorId
     * @param { TypeDecoratorSchema } typeDecoratorSchema
    */
    constructor(typeInfo, memberDecorators, typeDecoratorId = null, typeDecoratorSchema = new TypeDecoratorSchema()) {
        if (typeDecoratorId !== null && typeDecoratorId !== undefined && !(typeDecoratorId instanceof GUID)) {
            throw new Error(`The typeDecoratorId is not a ${GUID.name}`);
        }
        for (const memberDecorator of memberDecorators) {
            if (memberDecorator.member.parentType !== typeInfo) {
                throw new Error(`${memberDecorator.member.name} does not belong to ${typeInfo.name}`);
            }
        }
        const metadata = { memberDecorators: [] };
        super(typeInfo, typeDecoratorId, typeDecoratorSchema, metadata);
        metadata.memberDecorators = metadata.memberDecorators.concat(memberDecorators);
    }
}