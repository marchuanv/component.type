import { Type } from '../registry.mjs';
import { Animal, AnimalSimilar, AnimalUnknown, Dog } from './index.mjs';
describe(`when creating in instance of the ${Type.name} class given that the target is ${Animal.name}`, () => {
    let animal = null;
    beforeAll(() => {
        animal = new Animal();
    });
    it(`should have ${Animal.name} as the type`, () => {
        expect(animal).toBeDefined();
        expect(animal).not.toBeNull();
        expect(animal.metadata.type).toBe(Animal);
    });
});
describe(`when creating in instance of the ${Type.name} class given that the target is ${Dog.name} that extends the ${Animal.name} class`, () => {
    let dog = null;
    beforeAll(() => {
        dog = new Dog();
    });
    it(`should have ${Dog.name} as the type`, () => {
        expect(dog).toBeDefined();
        expect(dog).not.toBeNull();
        expect(dog.metadata.type).toBe(Dog);
        expect(dog.metadata.typeExtended).toContain(Animal);
        expect(dog.metadata.typeExtended).toContain(Dog);
    });
});
describe(`when getting a string representation of the ${Animal.name} class.`, () => {
    let animalStr = null;
    beforeAll(() => {
        const animal = new Animal();
        animalStr = animal.toString();
    });
    it(`should return a string`, () => {
        expect(animalStr).toBeDefined();
        expect(animalStr).not.toBeNull();
        expect(animalStr).toBe(JSON.stringify({ namespace:"component.types.metadata.animal", typeName:"Animal" }));
    });
});
describe('when creating a type given that the type already exists but it is different', () => {
    let error = null;
    beforeAll(() => {
        try {
            new Animal();
            new AnimalSimilar();
        } catch (err) {
            console.log(err);
            error = err;
        }
    });
    it('should raise an error', () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(`The Animal class already exists.`);
    });
});
describe(`when getting a type that does exist given a ${String.name}`, () => {
    let type = null;
    beforeAll(() => {
        type = Type.get(String.name);
    });
    it(`should return an instance of ${String.name}`, () => {
        expect(type).toBeDefined();
        expect(type).not.toBeNull();
        expect(type).toBe(String);
    });
});
describe(`when getting a type that does exist given a ${String.name}`, () => {
    let exists = null;
    beforeAll(() => {
        exists = Type.has(String.name);
    });
    it(`should return true`, () => {
        expect(exists).toBeDefined();
        expect(exists).not.toBeNull();
        expect(exists).toBeTrue();
    });
});
describe(`when getting a type that does not exist given the common namespace and ${AnimalUnknown.name} class`, () => {
    let error = null;
    beforeAll(() => {
        try {
            Type.get(AnimalUnknown.name);
        } catch (err) {
            error = err;
        }
    });
    it('should raise an error', () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(`${AnimalUnknown.name} was not found.`);
    });
});
