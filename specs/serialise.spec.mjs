import {
    Container,
} from "../registry.mjs";
import {
    Dog, Food,
} from './index.mjs';
describe('when deserialising the Dog class given correct json data', () => {
    it('should deserialise without error', async () => {
        let error = null;
        let serialisedDogStr = '';
        let dogInstance = null;
        const dog = new Dog('lassy', 12, 24, new Food('epol', true), 'dog');
        try {
            serialisedDogStr = await dog.serialise();
            dogInstance = await Container.deserialise(serialisedDogStr, Dog);
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
            await Container.deserialise(serialisedDogStr, Dog);
        } catch (err) {
            error = err;
            console.error(error);
        }
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
    });
});