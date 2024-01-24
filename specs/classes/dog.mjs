import {
    Animal, Food,
} from '../index.mjs';
export class Dog extends Animal {
    /**
     * @param { String } name
     * @param { Number } age
     * @param { Number } weight
     * @param { Food } food
     * @param { Array<String> } vaccinationYears
    */
    constructor(name, age, weight, food, vaccinationYears = ['2020', '2021', '2022']) {
        super(name, age, weight, food, vaccinationYears);
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
     * @returns { Number }
    */
    get age() {
        return super.get({ age: null });
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        super.set({ age: value });
    }
    /**
     * @returns { Number }
    */
    get weight() {
        return super.get({ weight: null });
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        super.set({ weight: value });
    }
    /**
     * @returns { Food }
    */
    get food() {
        return super.get({ food: null });
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        super.set({ food: value });
    }
    /**
     * @param { Number } meters
     * @returns { Boolean }
    */
    walk(meters) {

    }
}