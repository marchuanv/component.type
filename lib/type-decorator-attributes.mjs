import { GUID, MemberKind } from '../registry.mjs';
export class TypeDecoratorAttributes extends Array {
    /**
     * @param { GUID } memberId
     * @param { MemberKind } memberKind
    */
    push(memberId, memberKind) {
        super.push({ memberId, memberKind });
    }
    shift() {
        throw new Error('not implemented.');
    }
    unshift() {
        throw new Error('not implemented.');
    }
    map() {
        throw new Error('not implemented.');
    }
    fill() {
        throw new Error('not implemented.');
    }
    splice() {
        throw new Error('not implemented.');
    }
}