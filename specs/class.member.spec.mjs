import { } from "../lib/container.mjs";
import { Serialiser } from "../lib/serialiser.mjs";
import { ComplexType, Container, MemberParameter, PrimitiveType, Schema, TypeMapper } from "../registry.mjs";

describe('when ', () => {
    it('should', async () => {
        // const babyClassMember = new ClassMember(Baby);
        // let methods = babyClassMember.findAll({ isMethod: true });
        // let ctorMethods = babyClassMember.findAll({ isCtor: true });
        // let staticMethods = babyClassMember.findAll({ isMethod: true, isStatic: true });
        // let getterProperties = babyClassMember.findAll({ isProperty: true, isGetter: true });
        // let setterProperties = babyClassMember.findAll({ isProperty: true, isSetter: true });
        // expect(methods.length).toBe(1);
        // expect(ctorMethods.length).toBe(1);
        // expect(staticMethods.length).toBe(0);
        // expect(getterProperties.length).toBe(1);
        // expect(setterProperties.length).toBe(1);
        // const humanClassMember = babyClassMember.find('Human', true, false, false, false, false);
        // methods = humanClassMember.findAll({ isMethod: true });
        // ctorMethods = humanClassMember.findAll({ isCtor: true });
        // staticMethods = humanClassMember.findAll({ isMethod: true, isStatic: true });
        // getterProperties = humanClassMember.findAll({ isProperty: true, isGetter: true });
        // setterProperties = humanClassMember.findAll({ isProperty: true, isSetter: true });
        // expect(methods.length).toBe(0);
        // expect(ctorMethods.length).toBe(1);
        // expect(staticMethods.length).toBe(1);
        // expect(getterProperties.length).toBe(1);
        // expect(setterProperties.length).toBe(1);
        
        const baby = new Baby('john');

        // const serializer = new Serialiser(baby, Baby);

        // const str = await serializer.serialise();

        // console.log();


        // const obj = Serialiser.deserialise(str, Baby);

    });
});

class Human extends Container {
    /**
     * @param { String } name
     * @param { Number } age
     * @param { Number } height
     * @param { Number } weight
     * @param { Array<String> } parts
     * @param {{ heart: Boolean }} organs
    */
    constructor(name, age, height, weight, parts = ['head', 'feet', 'legs', 'arms'], organs = { heart: true }) {
        super([
            new MemberParameter( { name }, new TypeMapper(PrimitiveType.String)),
            new MemberParameter({ age }, new TypeMapper(PrimitiveType.Number)),
            new MemberParameter({ height }, new TypeMapper(PrimitiveType.Number)),
            new MemberParameter({ weight }, new TypeMapper(PrimitiveType.Number)),
            new MemberParameter({ parts }, new TypeMapper(ComplexType.StringArray)),
            new MemberParameter({ organs }, new TypeMapper(ComplexType.Object))
        ]);
        this._age = age;
    }
    /**
     * @returns { Number }
    */
    get age() {
        return this._age;
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        this._age = value;
    }
    /**
     * @param { Number } age
     * @param { Array<String> } parts
     * @param { Number } height
     * @param { Number } weight
     * @param {{ heart: Boolean }} organs
     * @returns { Human }
    */
    static create(age = 1, parts = ['head', 'feet', 'legs', 'arms'], height, weight, organs = { heart: true }) {
    }
}

class Baby extends Human {
    /**
     * @param { String } name
    */
    constructor(name) {
        super(name, 1, 49, 3.3);
        this._name = name;
    }
    /**
     * @returns { String }
    */
    get name() {
        return this._name;
    }
    /**
     * @param { String } value
    */
    set name(value) {
        this._name = value;
    }
    /**
     * @param { Number } age
    */
    setAge(age) {
        super.age = age;
    }
}