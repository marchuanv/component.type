import { GUID, Schema, Store, TypeInfo } from '../registry.mjs';
const secureContext = {};
class MemberKindSchema extends Schema {
    /**
     * @param { String } memberKind
    */
    constructor(memberKind) {
        super([{
            name: memberKind,
            typeInfo: new TypeInfo({ type: String })
        }]);
    }
}
export class MemberKind extends Store {
    /**
     * @param { String } memberKind
    */
    constructor(memberKind) {
        const Id = new GUID({ memberKind });
        super(Id, new MemberKindSchema(memberKind), secureContext);
    }
    get name() {
        return super.get(secureContext);
    }
    /**
     * @returns { MemberKind }
    */
    static get Class() { return new MemberKind('Class'); }
    /**
     * @returns { MemberKind }
    */
    static get Property() { return new MemberKind('Property'); }
    /**
     * @returns { MemberKind }
    */
    static get Method() { return new MemberKind('Method'); }
}