import { Specs } from '../registry.mjs';
export { Animal } from './classes/animal.mjs';
export { Dog } from './classes/dog.mjs';
export { Food } from './classes/food.mjs';
const specs = new Specs(60000, './');
specs.run();