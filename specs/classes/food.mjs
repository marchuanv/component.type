import {
    Container,
    CtorArgs
} from '../../registry.mjs';
export class FoodCtorArgs extends CtorArgs {

    /**
     * @returns { String }
    */
    get name() {
        return super.get({ name: null });
    }
    /**
     * @param { String } value
    */
    set name(value) {
        super.set({ name: value });
    }

    /**
     * @returns { Boolean }
    */
    get isAdultFood() {
        return super.get({ isAdultFood: null });
    }
    /**
     * @param { Boolean } value
    */
    set isAdultFood(value) {
        super.set({ isAdultFood: value });
    }
}
export class Food extends Container {
    /**
     * @param { FoodCtorArgs } foodArgs
    */
    constructor(foodArgs) {
        super(foodArgs);
    }
    /**
     * @returns { String }
    */
    get name() {
        return super.get({ name: null });
    }
    /**
     * @param { String } value
    */
    set name(value) {
        super.set({ name: value });
    }
    /**
     * @returns { Boolean }
    */
    get isAdultFood() {
        return super.get({ isAdultFood: null });
    }
    /**
     * @param { Boolean } value
    */
    set isAdultFood(value) {
        super.set({ isAdultFood: value });
    }
}