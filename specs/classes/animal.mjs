import {
    Container,
    CtorArgs
} from '../../registry.mjs';
import {
    Food
} from '../index.mjs';
export class AnimalCtorArgs extends CtorArgs {

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
     * @returns { String }
    */
    get type() {
        return super.get({ type: null });
    }
    /**
     * @param { String } value
    */
    set type(value) {
        super.set({ type: value });
    }

    /**
     * @returns { Array<String> }
    */
    get vaccinationYears() {
        return super.get({ vaccinationYears: null });
    }
    /**
     * @returns { Array<String> }
    */
    set vaccinationYears(value) {
        super.set({ vaccinationYears: value });
    }
}
export class Animal extends Container {
    /**
     * @param { AnimalCtorArgs } animalArgs
    */
    constructor(animalArgs) {
        super(animalArgs);
    }
    /**
     * @returns { String }
    */
    get type() {
        return super.get({ type: null });
    }
    /**
     * @param { String } value
    */
    set type(value) {
        super.set({ type: value });
    }
    /**
     * @returns { Array<String> }
    */
    get vaccinationYears() {
        return super.get({ vaccinationYears: null });
    }
    /**
     * @template T
     * @param { T } type
     * @returns { T }
    */
    animalType(type) {
    }
}
