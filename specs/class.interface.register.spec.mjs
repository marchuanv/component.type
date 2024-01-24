import {
    ClassInterfaceRegister,
    fileURLToPath,
    join,
} from "../registry.mjs";
import {
    Animal,
    Dog, Food,
} from './index.mjs';
const currentDir = fileURLToPath(new URL('./', import.meta.url));
const scriptsDirPath = join(currentDir, 'classes');
describe('when registering and generating the Dog class inteface', () => {
    fit('should generate', async () => {
        await ClassInterfaceRegister.register([{
            scriptsDirPath,
            scriptFileName: 'food.mjs',
            targetClass: Food
        }, {
            scriptsDirPath,
            scriptFileName: 'animal.mjs',
            targetClass: Animal
        }, {
            scriptsDirPath,
            scriptFileName: 'dog.mjs',
            targetClass: Dog
        }]);
        await ClassInterfaceRegister.generate(Food);
        await ClassInterfaceRegister.generate(Animal);
        await ClassInterfaceRegister.generate(Dog);
    });
});