import { Type, TypeReferenceContext, TypeRegisterEntry } from '../registry.mjs';
import { Animal, Dog, Food } from './index.mjs';

new Type(Animal);
new Type(Food);
new Type(Dog);

const dogTypeRegisterEntry = new TypeRegisterEntry(Dog);
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
});
