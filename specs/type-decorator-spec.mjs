import { GUID, TypeDecorator, TypeInfo } from '../registry.mjs';
import { Dog } from './index.mjs';
describe('when creating a type decorator', () => {
    it(`should decorate a type with member data and retrieve before decorated type provided a typeDecoratorId`, () => {
        try {
            const typeInfo = new TypeInfo({ type: Dog });

            let typeDecor = new TypeDecorator(typeInfo);
            const originalId = typeDecor.Id;

            expect(typeDecor.Id).toBeDefined();
            expect(typeDecor.Id).not.toBeNull();
            expect(typeDecor.Id).toBeInstanceOf(GUID);

            expect(typeDecor.type).toBeDefined();
            expect(typeDecor.type).not.toBeNull();
            expect(typeDecor.type).toBe(Dog);

            expect(typeDecor.name).toBeDefined();
            expect(typeDecor.name).not.toBeNull();
            expect(typeDecor.name).toBe(Dog.name);

            expect(typeDecor.isClass).toBeDefined();
            expect(typeDecor.isClass).not.toBeNull();
            expect(typeDecor.isClass).toBeTrue();

            expect(typeDecor.isPrimitive).toBeDefined();
            expect(typeDecor.isPrimitive).not.toBeNull();
            expect(typeDecor.isPrimitive).toBeFalse();

            typeDecor = new TypeDecorator(null, originalId);

            expect(typeDecor.Id).toBeDefined();
            expect(typeDecor.Id).not.toBeNull();
            expect(typeDecor.Id).toBeInstanceOf(GUID);

            expect(typeDecor.type).toBeDefined();
            expect(typeDecor.type).not.toBeNull();
            expect(typeDecor.type).toBe(Dog);

            expect(typeDecor.name).toBeDefined();
            expect(typeDecor.name).not.toBeNull();
            expect(typeDecor.name).toBe(Dog.name);

            expect(typeDecor.isClass).toBeDefined();
            expect(typeDecor.isClass).not.toBeNull();
            expect(typeDecor.isClass).toBeTrue();

            expect(typeDecor.isPrimitive).toBeDefined();
            expect(typeDecor.isPrimitive).not.toBeNull();
            expect(typeDecor.isPrimitive).toBeFalse();

            expect(typeDecor.members.length).toBeGreaterThan(0);

            expect(typeDecor.Id).toBe(originalId);

        } catch (error) {
            fail(`did not expected any errors. Error: ${error.message}`);
            console.log(error);
        }
    });
});