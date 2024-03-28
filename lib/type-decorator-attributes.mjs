import { TypeMemberInfo } from '../registry.mjs';
export class TypeDecoratorAttributes extends Map {
    /**
     * @param { TypeMemberInfo } memberInfo
     * @param { String } attribute
    */
    set(memberInfo, attribute) {
        super.set(memberInfo.Id, attribute);
    }
    /**
     * @param { TypeMemberInfo } memberInfo
     * @returns { String }
    */
    get(memberInfo) {
        return super.get(memberInfo.Id);
    }
}