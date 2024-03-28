import {
    GUID,
    TypeDecoratorAttributes,
    TypeDecoratorSchema,
    TypeMemberDecoratorSchema,
    TypeMemberInfo,
    TypeRegister
} from '../registry.mjs';
const secureContext = {};
export class TypeMemberDecorator extends TypeRegister {
    /**
     * @param { TypeMemberInfo } memberInfo
     * @param { TypeDecoratorAttributes } attributes
     * @param { GUID } typeMemberDecoratorId
     * @param { TypeDecoratorSchema } typeMemberDecoratorSchema
    */
    constructor(memberInfo, attributes, typeMemberDecoratorId = null, typeMemberDecoratorSchema = new TypeMemberDecoratorSchema()) {
        if (typeMemberDecoratorId !== null && typeMemberDecoratorId !== undefined && !(typeMemberDecoratorId instanceof GUID)) {
            throw new Error(`The typeMemberDecoratorId is not a ${GUID.name}`);
        }
        const metadata = { member: null, attributes: [] };
        super(memberInfo.type, typeMemberDecoratorId, typeMemberDecoratorSchema, metadata);
        if (metadata.member === null || metadata.member === undefined) {
            metadata.member = memberInfo;
        }
        metadata.attributes = metadata.attributes.concat(attributes);
    }
    /**
     * @returns { TypeMemberInfo }
    */
    get member() {
        const { member } = super.get(secureContext);
        return member;
    }
}