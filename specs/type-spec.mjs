import { Type } from '../registry.mjs';
class ClassA { }
class UnknownClass { }
class TestType extends Type {
    /**
     * @param { Object } target
    */
    constructor(target) {
        super(Type.namespace, target);
    }
}
class TestTypeWrongNamespace extends Type {
    /**
     * @param { Object } target
    */
    constructor(target) {
        super('awdawdawd', target);
    }
}
describe('when creating types given the same namespaces', () => {
    it('should have equality', () => {
        const typeA = new TestType(ClassA);
        const typeB = new TestType(ClassA);
        expect(typeA).toBeDefined();
        expect(typeA).not.toBeNull();
        expect(typeB).toBeDefined();
        expect(typeB).not.toBeNull();
        expect(typeA).toBe(typeB);
        expect(typeA).toEqual(typeB);
    });
});
describe('when creating types given the wrong namespace', () => {
    let error = null;
    beforeAll(() => {
        try {
            new TestTypeWrongNamespace(ClassA);    
        } catch (err) {
            error = err;
        }
    });
    it(`should raise an error`, () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('namespace argument does not start with component.types.');
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