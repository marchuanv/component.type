import { TypeReference } from "../../registry.mjs";
export class Animal extends TypeReference {
    /**
     * @returns { String }
    */
    get type() {
        return super.get({ type: null }, String);
    }
    /**
     * @param { String } value
    */
    set type(value) {
        super.set({ type: value }, String);
    }
    /**
     * @returns { Array<String> }
    */
    get vaccinationYears() {
        return super.get({ vaccinationYears: null }, Array);
    }
}
