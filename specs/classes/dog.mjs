
import { Animal, AnimalCtorArgs } from './animal.mjs';
export class DogCtorArgs extends AnimalCtorArgs { }
export class Dog extends Animal {
    /**
     * @param { DogCtorArgs } dogArgs
    */
    constructor(dogArgs) {
        super(dogArgs);
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
    */
    walk(meters) {

    }
    /**
     * @returns { Boolean }
    */
    isExhausted() {

    }
}