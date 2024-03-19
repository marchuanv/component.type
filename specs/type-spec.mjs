import { Type, TypeReferenceContext, TypeRegisterEntry } from '../registry.mjs';
import { Animal, Dog, Food } from './index.mjs';

new Type(Animal);
new Type(Food);
new Type(Dog);

const animalTypeRegisterEntry = new TypeRegisterEntry(Animal);
const dogTypeRegisterEntry = new TypeRegisterEntry(Dog, [Animal, Food]);
const foodTypeRegisterEntry = new TypeRegisterEntry(Food);

describe(`when creating in instance of the ${Dog.name} class given that it extends the ${Animal.name} class`, () => {
    it(`should have the ${Animal.name} and ${Dog.name} extended classes`, () => {
        try {
            const dog = new Dog(new TypeReferenceContext(dogTypeRegisterEntry));
            expect(dog.extended).toContain(Animal, `does not have the ${Animal.name} class.`);
            expect(dog.extended).toContain(Dog, `does not have the ${Dog.name} class.`);
            dog.vaccinationYears;
            dog.isAdultFood;
        } catch (error) {
            console.log(error);
            fail('did not expect any errors');
        }
    });
    it(`should associate ${Food.name} type with ${Dog.name} type`, () => {
        try {
            const dog = new Dog(new TypeReferenceContext(dogTypeRegisterEntry));
            const food = new Food(new TypeReferenceContext(foodTypeRegisterEntry));
            expect(dog).toBeDefined();
            expect(dog).not.toBeNull();
            dog.associate(food);
            expect(dog.associations).toContain(Food, `could not associate ${Dog.name} with ${Food.name}.`);
            expect(food.associations).toContain(Dog, `could not associate ${Food.name} with ${Dog.name}.`);
        } catch (error) {
            console.log(error);
            fail('did not expect any errors');
        }
    });
    it(`should associate the ${Food.name} type with the ${Dog.name} class`, () => {
        try {
            const animal = new Animal(new TypeReferenceContext(animalTypeRegisterEntry));
            expect(animal).toBeDefined();
            expect(animal).not.toBeNull();
            animal.associate(Food);
            expect(animal.associations).toContain(Food, `could not associate ${Animal.name} with ${Food.name}.`);
        } catch (error) {
            console.log(error);
            fail('did not expect any errors');
        }
    });
});
