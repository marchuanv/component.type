import { dirname, fileURLToPath, join } from "utils";
import { ClassFile } from "../lib/class.file.mjs";
const currentDirPath = dirname(fileURLToPath(import.meta.url));
describe('when loading a js module script', () => {
    it('should identify classes and provide all the exported class names', async () => {
        const classFiles = new ClassFile(join(currentDirPath, 'classes', 'dog.mjs'));
        await classFiles.load();

        expect(classFiles.exports).toBeDefined();
        expect(classFiles.exports).not.toBeNull();

        expect(classFiles.imports).toBeDefined();
        expect(classFiles.imports).not.toBeNull();

        expect(classFiles.exports.length).toBe(2);
        expect(classFiles.imports.length).toBe(2);

        expect(classFiles.exports[0]).toBe('DogCtorArgs');
        expect(classFiles.exports[1]).toBe('Dog');

        expect(classFiles.imports[0]).toBe('Animal');
        expect(classFiles.imports[1]).toBe('AnimalCtorArgs');
    });
});