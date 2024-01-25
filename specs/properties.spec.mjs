import {
    Dog,
    DogCtorArgs,
    Food,
    FoodCtorArgs
} from './index.mjs';
describe('when container properties change', () => {
    it('should sync data', () => {

        const expectedName = 'Parody';
        const expectedAge = 5;

        const foodArgs = new FoodCtorArgs();
        foodArgs.isAdultFood = true;
        foodArgs.name = 'epol';

        const dogArgs = new DogCtorArgs();
        dogArgs.age = expectedAge;
        dogArgs.name = expectedName;
        dogArgs.food = new Food(foodArgs);
        dogArgs.type = 'dog';
        dogArgs.weight = 24;
        dogArgs.vaccinationYears = ['2010', '2011', '2012'];

        const dog = new Dog(dogArgs);
        expect(dog.name).toBe(expectedName);
        expect(dog.age).toBe(expectedAge);

        let fireCount = 0;
        dog.onSet({ name: null }, (value) => {
            fireCount = fireCount + 1;
            return expectedName;
        });
        dog.onSet({ age: null }, (value) => {
            fireCount = fireCount + 1;
            return expectedAge;
        });
        dog.age = 25; //onChange
        dog.name = 'Lassy'; //onChange

        expect(fireCount).toBe(2);
        expect(dog.name).toBe(expectedName);
        expect(dog.age).toBe(expectedAge);
    });
});
