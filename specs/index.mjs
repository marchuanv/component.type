import { ClassInterfaceRegister, Specs, fileURLToPath, join } from "../registry.mjs";
import { Animal } from "./classes/animal.mjs";
import { Dog } from "./classes/dog.mjs";
import { Food } from "./classes/food.mjs";
(async () => {
    const currentDir = fileURLToPath(new URL('./', import.meta.url));
    const scriptsDirPath = join(currentDir, 'classes');
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
    const specs = new Specs(60000, './');
    specs.run();
})().catch((err) => console.error(err));
export { Animal, Dog, Food };
