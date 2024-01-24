import {
    Container,
    MemberParameter
} from '../../registry.mjs';
import {
    Food,
} from '../index.mjs';
export class Animal extends Container {
    /**
     * @param { String } name
     * @param { Number } age
     * @param { Number } weight
     * @param { Food } food
     * @param { String } type
     * @param { Array<String> } vaccinationYears
    */
    constructor(name, age, weight, food, type, vaccinationYears) {
        super([
            new MemberParameter({ name }, String),
            new MemberParameter({ age }, Number),
            new MemberParameter({ weight }, Number),
            new MemberParameter({ food }, Food),
            new MemberParameter({ type }, String),
            new MemberParameter({ vaccinationYears }, Array)
        ]);
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
