import {
    Animal,
    Food
} from '../index.mjs';
export class Dog extends Animal {
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
     * @returns { Number }
    */
    get age() {
        return super.get({ age: null }, Number);
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        super.set({ age: value }, Number);
    }
    /**
     * @returns { Number }
    */
    get weight() {
        return super.get({ weight: null }, Number);
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        super.set({ weight: value }, Number);
    }
    /**
     * @returns { Food }
    */
    get food() {
        return super.get({ food: null }, Food);
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        super.set({ food: value }, Food);
    }
    /**
     * @param { Number } meters
    */
    walk(meters) { }
    /**
     * @returns { Boolean }
    */
    isExhausted() { }
}