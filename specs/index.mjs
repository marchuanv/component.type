import { CtorArgsRegistry, GUID, Specs } from "../registry.mjs";
import { Animal, AnimalCtorArgs } from "./classes/animal.mjs";
import { Dog, DogCtorArgs } from "./classes/dog.mjs";
import { Food, FoodCtorArgs } from "./classes/food.mjs";

CtorArgsRegistry.register(new GUID('b6186616-ade2-4808-9ebb-ac3d07a05979'), AnimalCtorArgs, Animal);
CtorArgsRegistry.register(new GUID('4378c3e1-8453-4a54-a8eb-03d1ad5fc30f'), DogCtorArgs, Dog);
CtorArgsRegistry.register(new GUID('72b46191-f190-4c1e-82f5-a4084d532d24'), FoodCtorArgs, Food);

const specs = new Specs(60000, './');
specs.run();
export { Animal, AnimalCtorArgs, Dog, DogCtorArgs, Food, FoodCtorArgs };

