export class FoodCtorArgs {
    /**
     * @returns { String }
    */
    get name() {
        return this.get({ name: null });
    }
    /**
     * @param { String } value
    */
    set name(value) {
        this.set({ name: value });
    }

    /**
     * @returns { Boolean }
    */
    get isAdultFood() {
        return this.get({ isAdultFood: null });
    }
    /**
     * @param { Boolean } value
    */
    set isAdultFood(value) {
        this.set({ isAdultFood: value });
    }
}
export class Food {
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