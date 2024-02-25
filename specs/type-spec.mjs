import { Type } from '../registry.mjs';
class ClassA { }
class UnknownClass { }
class TestType extends Type {}
describe(`when creating in instance of the ${Type.name} class given that the target is ${ClassA.name}`, () => {
    it('should return ClassA as the type', () => {
        const { type } = new TestType(ClassA);
        expect(type).toBeDefined();
        expect(type).not.toBeNull();
        expect(type).toBe(ClassA)
    });
});
describe('when creating a type given that the type already exists but it is different', () => {
    let error = null;
    beforeAll(() => {
        try {
            {
                class ClassB { get name() { return 'ClassBV1' } }
                new TestType(ClassB);
            }
            {
                class ClassB { get name() { return 'ClassBV2' } }
                new TestType(ClassB);
            }
        } catch (err) {
            error = err;
        }
    });
    it('should raise an error', () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(`ClassB already exists.`);
    });
});
describe(`when getting a type that does exist given a ${String.name}`, () => {
    let type = null;
    beforeAll(() => {
        type = Type.get(String.name);
    });
    it(`should return an instance of ${String.name}`, () => {
        expect(type).toBeDefined();
        expect(type).not.toBeNull();
        expect(type).toBe(String);
    });
});
describe(`when getting a type that does exist given a ${String.name}`, () => {
    let exists = null;
    beforeAll(() => {
        exists = Type.has(String.name);
    });
    it(`should return true`, () => {
        expect(exists).toBeDefined();
        expect(exists).not.toBeNull();
        expect(exists).toBeTrue();
    });
});
describe(`when getting a type that does not exist given the common namespace and ${UnknownClass.name} class`, () => {
    let error = null;
    beforeAll(() => {
        try {
            Type.get(UnknownClass.name);
        } catch (err) {
            error = err;
        }
    });
    it('should raise an error', () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(`${UnknownClass.name} was not found.`);
    });
});