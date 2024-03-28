import { GUID, Reflection, TypeInfo, TypeRegister } from '../registry.mjs';
import { Dog } from './index.mjs';
fdescribe('when registering a type', () => {
    fit(`should register undefined primitive type without error`, () => {
        const { name } = Reflection.getPrimitiveTypes().find(x => x.name === 'undefined');
        try {

            const typeInfo = new TypeInfo({ name });

            const typeRegister = new TypeRegister(typeInfo);

            expect(typeRegister.Id).toBeDefined();
            expect(typeRegister.Id).not.toBeNull();
            expect(typeRegister.Id).toBeInstanceOf(GUID);

            expect(typeRegister.typeInfo).toBeDefined();
            expect(typeRegister.typeInfo).not.toBeNull();
            expect(typeRegister.typeInfo).toBeInstanceOf(TypeInfo);

            expect(typeRegister.typeInfo).toBe(typeRegister.Id);

            expect(typeRegister.typeInfo.type).toBeDefined();
            expect(typeRegister.typeInfo.type).not.toBeNull();
            expect(typeRegister.typeInfo.type()).toBe(undefined);

            expect(typeRegister.typeInfo.name).toBeDefined();
            expect(typeRegister.typeInfo.name).not.toBeNull();
            expect(typeRegister.typeInfo.name).toBe('undefined');

            expect(typeRegister.typeInfo.isClass).toBeDefined();
            expect(typeRegister.typeInfo.isClass).not.toBeNull();
            expect(typeRegister.typeInfo.isClass).toBeFalse();

            expect(typeRegister.typeInfo.isPrimitive).toBeDefined();
            expect(typeRegister.typeInfo.isPrimitive).not.toBeNull();
            expect(typeRegister.typeInfo.isPrimitive).toBeTrue();

        } catch (error) {
            fail(`did not expected any errors when registering an undefined primitive type. Error: ${error.message}`);
            console.log(error.stack);
        }
    });
    it(`should register null primitive type without error`, () => {
        const { name } = Reflection.getPrimitiveTypes().find(x => x.name === 'null');
        try {

            const typeInfo = new TypeInfo({ name });

            const typeRegister = new TypeRegister(typeInfo);

            expect(typeRegister.Id).toBeDefined();
            expect(typeRegister.Id).not.toBeNull();
            expect(typeRegister.Id).toBeInstanceOf(GUID);

            expect(typeRegister.typeInfo).toBeDefined();
            expect(typeRegister.typeInfo).not.toBeNull();
            expect(typeRegister.typeInfo).toBeInstanceOf(TypeInfo);

            expect(typeRegister.typeInfo).toBe(typeRegister.Id);

            expect(typeRegister.typeInfo.type).toBeDefined();
            expect(typeRegister.typeInfo.type).not.toBeNull();
            expect(typeRegister.typeInfo.type()).toBe(null);

            expect(typeRegister.typeInfo.name).toBeDefined();
            expect(typeRegister.typeInfo.name).not.toBeNull();
            expect(typeRegister.typeInfo.name).toBe('null');

            expect(typeRegister.typeInfo.isClass).toBeDefined();
            expect(typeRegister.typeInfo.isClass).not.toBeNull();
            expect(typeRegister.typeInfo.isClass).toBeFalse();

            expect(typeRegister.typeInfo.isPrimitive).toBeDefined();
            expect(typeRegister.typeInfo.isPrimitive).not.toBeNull();
            expect(typeRegister.typeInfo.isPrimitive).toBeTrue();

        } catch (error) {
            fail(`did not expected any errors when registering a null primitive type. Error: ${error.message}`);
        }
    });
    it(`should register primitive types without error`, () => {
        for (const { name, type } of Reflection.getPrimitiveTypes().filter(x => x.name !== 'undefined' && x.name !== 'null')) {
            try {

                const typeInfo = new TypeInfo({ type });

                const typeRegister = new TypeRegister(typeInfo);

                expect(typeRegister.Id).toBeDefined();
                expect(typeRegister.Id).not.toBeNull();
                expect(typeRegister.Id).toBeInstanceOf(GUID);

                expect(typeRegister.typeInfo).toBeDefined();
                expect(typeRegister.typeInfo).not.toBeNull();
                expect(typeRegister.typeInfo).toBeInstanceOf(TypeInfo);

                expect(typeRegister.typeInfo).toBe(typeRegister.Id);

                expect(typeRegister.typeInfo.type).toBeDefined();
                expect(typeRegister.typeInfo.type).not.toBeNull();
                expect(typeRegister.typeInfo.type).toBe(type);

                expect(typeRegister.typeInfo.name).toBeDefined();
                expect(typeRegister.typeInfo.name).not.toBeNull();
                expect(typeRegister.typeInfo.name).toBe(name);

                expect(typeRegister.typeInfo.isClass).toBeDefined();
                expect(typeRegister.typeInfo.isClass).not.toBeNull();
                expect(typeRegister.typeInfo.isClass).toBeFalse();

                expect(typeRegister.typeInfo.isPrimitive).toBeDefined();
                expect(typeRegister.typeInfo.isPrimitive).not.toBeNull();
                expect(typeRegister.typeInfo.isPrimitive).toBeTrue();

            } catch (error) {
                fail(`did not expected any errors when registering ${name}. Error: ${error.message}`);
            }
        }
    });
    it(`should register class types without error`, () => {
        try {

            const typeInfo = new TypeInfo({ type: Dog });

            const typeRegister = new TypeRegister(typeInfo);

            expect(typeRegister.Id).toBeDefined();
            expect(typeRegister.Id).not.toBeNull();
            expect(typeRegister.Id).toBeInstanceOf(GUID);

            expect(typeRegister.typeInfo).toBeDefined();
            expect(typeRegister.typeInfo).not.toBeNull();
            expect(typeRegister.typeInfo).toBeInstanceOf(TypeInfo);

            expect(typeRegister.typeInfo).toBe(typeRegister.Id);

            expect(typeRegister.typeInfo.type).toBeDefined();
            expect(typeRegister.typeInfo.type).not.toBeNull();
            expect(typeRegister.typeInfo.type).toBe(Dog);

            expect(typeRegister.typeInfo.name).toBeDefined();
            expect(typeRegister.typeInfo.name).not.toBeNull();
            expect(typeRegister.typeInfo.name).toBe(Dog.name);

            expect(typeRegister.typeInfo.isClass).toBeDefined();
            expect(typeRegister.typeInfo.isClass).not.toBeNull();
            expect(typeRegister.typeInfo.isClass).toBeTrue();

            expect(typeRegister.typeInfo.isPrimitive).toBeDefined();
            expect(typeRegister.typeInfo.isPrimitive).not.toBeNull();
            expect(typeRegister.typeInfo.isPrimitive).toBeFalse();

        } catch (error) {
            fail(`did not expected any errors when registering ${Dog.name}. Error: ${error.message}`);
        }
    });
    it(`should reconstruct registered class without error`, () => {
        try {

            const typeInfo = new TypeInfo({ type: Dog });

            const typeRegister = new TypeRegister(typeInfo);

            expect(typeRegister.Id).toBeDefined();
            expect(typeRegister.Id).not.toBeNull();
            expect(typeRegister.Id).toBeInstanceOf(GUID);

            expect(typeRegister.typeInfo).toBeDefined();
            expect(typeRegister.typeInfo).not.toBeNull();
            expect(typeRegister.typeInfo).toBeInstanceOf(TypeInfo);

            expect(typeRegister.typeInfo).toBe(typeRegister.Id);

            expect(typeRegister.typeInfo.type).toBeDefined();
            expect(typeRegister.typeInfo.type).not.toBeNull();
            expect(typeRegister.typeInfo.type).toBe(Dog);

            expect(typeRegister.typeInfo.name).toBeDefined();
            expect(typeRegister.typeInfo.name).not.toBeNull();
            expect(typeRegister.typeInfo.name).toBe(Dog.name);

            expect(typeRegister.typeInfo.isClass).toBeDefined();
            expect(typeRegister.typeInfo.isClass).not.toBeNull();
            expect(typeRegister.typeInfo.isClass).toBeTrue();

            expect(typeRegister.typeInfo.isPrimitive).toBeDefined();
            expect(typeRegister.typeInfo.isPrimitive).not.toBeNull();
            expect(typeRegister.typeInfo.isPrimitive).toBeFalse();

            const sameTypeRegister = new TypeRegister(null, typeRegister.Id);

            expect(sameTypeRegister.typeInfo).toBe(typeRegister.typeInfo);

        } catch (error) {
            fail(`did not expected any errors when registering ${Dog.name}. Error: ${error.message}`);
        }
    });
    it(`should raise an error if no type is provided`, () => {
        try {
            new TypeRegister();
            fail('expected an error');
        } catch (error) {
            console.log(error);
            expect(error.message).toBe(`The typeInfo argument is null, undefined or not an instance of TypeInfo.`);
        }
    });
});