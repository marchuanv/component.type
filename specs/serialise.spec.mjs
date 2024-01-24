import {
    Container,
} from "../registry.mjs";
import {
    Dog, DogCtorArgs, Food, FoodCtorArgs,
} from './index.mjs';
describe('when deserialising the Dog class given an instance of dog ctor args', () => {
    it('should deserialise without error', async () => {
        let error = null;
        let serialisedDogStr = '';
        let dogInstance = null;

        const foodArgs = new FoodCtorArgs();
        foodArgs.isAdultFood = true;
        foodArgs.name = 'epol';

        const dogArgs = new DogCtorArgs();
        dogArgs.age = 12;
        dogArgs.name = 'lassy';
        dogArgs.food = new Food(foodArgs);
        dogArgs.type = 'dog';
        dogArgs.weight = 24;
        dogArgs.vaccinationYears = ['2010', '2011', '2012'];

        const dog = new Dog(dogArgs);
        try {
            serialisedDogStr = await dog.serialise();
            dogInstance = await Container.deserialise(serialisedDogStr, Dog, DogCtorArgs);
        } catch (err) {
            error = err;
            console.error(error);
        }
        expect(error).toBeNull();
        expect(dogInstance).not.toBeNull();
        expect(dogInstance).toBeInstanceOf(Dog);
    });
});

describe('when deserialising the Dog class given incorrect json data', () => {
    it('should NOT deserialise', async () => {
        let error = null;
        const serialisedDogStr = JSON.stringify({
            name: "lassy",
            age: 23,
            weight: 15,
            food: {
                name: "epol",
                awdawdisAdultFood: true
            },
            type: 'dog',
            vaccinationYears: "test"
        });
        try {
            await Container.deserialise(serialisedDogStr, Dog, DogCtorArgs);
        } catch (err) {
            error = err;
            console.error(error);
        }
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
    });
});