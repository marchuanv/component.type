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
        return this.get({ name: null });
    }
    /**
     * @param { String } value
    */
    set name(value) {
        this.set({ name: value });
    }

    /**
     * @returns { Number }
    */
    get age() {
        return this.get({ age: null });
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        this.set({ age: value });
    }

    /**
     * @returns { Number }
    */
    get weight() {
        return this.get({ weight: null });
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        this.set({ weight: value });
    }

    /**
     * @returns { Food }
    */
    get food() {
        return this.get({ food: null });
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        this.set({ food: value });
    }

    /**
     * @returns { String }
    */
    get type() {
        return this.get({ type: null });
    }
    /**
     * @param { String } value
    */
    set type(value) {
        this.set({ type: value });
    }

    /**
     * @returns { Array<String> }
    */
    get vaccinationYears() {
        return this.get({ vaccinationYears: null });
    }
    /**
     * @returns { Array<String> }
    */
    set vaccinationYears(value) {
        this.set({ vaccinationYears: value });
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
