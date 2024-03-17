import { TypeReferenceContext, TypeRegisterEntry } from '../registry.mjs';
import { Animal, Dog, Food } from './index.mjs';
const dogTypeRegisterEntry = new TypeRegisterEntry(Dog, [{
    propertyName: 'name', propertyType: String 
}]);
const foodTypeRegisterEntry = new TypeRegisterEntry(Food, [{
    propertyName: 'name', propertyType: String 
}]);
const animalTypeRegisterEntry = new TypeRegisterEntry(Animal, [{
    propertyName: 'type', propertyType: String 
}]);
describe(`when creating in instance of the ${Dog.name} class given that it extends the ${Animal.name} class`, () => {
    it(`should have the ${Animal.name} and ${Dog.name} extended classes`, () => {
        const dog = new Dog(new TypeReferenceContext(dogTypeRegisterEntry));
        expect(dog).toBeDefined();
        expect(dog).not.toBeNull();
        expect(dog.extended).toContain(Animal, `does not have the ${Animal.name} class.`);
        expect(dog.extended).toContain(Dog, `does not have the ${Dog.name} class.`);
    });
    it(`should associate ${Food.name} type with ${Dog.name} type`, () => {
        const dog = new Dog(new TypeReferenceContext(dogTypeRegisterEntry));
        const food = new Food(new TypeReferenceContext(foodTypeRegisterEntry));
        expect(dog).toBeDefined();
        expect(dog).not.toBeNull();
        dog.associate(food);
        expect(dog.associations).toContain(Food, `could not associate ${Dog.name} with ${Food.name}.`);
        expect(food.associations).toContain(Dog, `could not associate ${Food.name} with ${Dog.name}.`);
    });
    it(`should associate the ${Food.name} type with the ${Dog.name} class`, () => {
        const animal = new Animal(new TypeReferenceContext(animalTypeRegisterEntry));
        expect(animal).toBeDefined();
        expect(animal).not.toBeNull();
        animal.associate(Food);
        expect(animal.associations).toContain(Food, `could not associate ${Animal.name} with ${Food.name}.`);
    });
});
