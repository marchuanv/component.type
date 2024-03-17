import { TypeReference } from "../../registry.mjs";
export class Food extends TypeReference {
    /**
     * @returns { String }
    */
    get name() {
        return super.get({ name: null }, String);
    }
    /**
     * @param { String } value
    */
    set name(value) {
        super.set({ name: value }, String);
    }
    /**
     * @returns { Boolean }
    */
    get isAdultFood() {
        return super.get({ isAdultFood: null }, Boolean);
    }
    /**
     * @param { Boolean } value
    */
    set isAdultFood(value) {
        super.set({ isAdultFood: value }, Boolean);
    }
}