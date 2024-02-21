import { Type } from '../registry.mjs';
class ClassA { }
describe('when creating types given the same namespaces', () => {
    it('should have equality', () => {
        const typeA = new Type('segment.segment1', ClassA);
        const typeB = new Type('segment.segment1', ClassA);
        expect(typeA).toBeDefined();
        expect(typeA).not.toBeNull();
        expect(typeB).toBeDefined();
        expect(typeB).not.toBeNull();
        expect(typeA).toBe(typeB);
        expect(typeA).toEqual(typeB);
    });
});
describe(`when getting a type that does exist given the common namespace and ${String.name} class`, () => {
    let type = null;
    beforeAll(() => {
        type = Type.get('common', String);
    });
    it('should return an instance of type', () => {
        expect(type).toBeDefined();
        expect(type).not.toBeNull();
        expect(type).toBeInstanceOf(Type);
    });
});
class UnknownClass { }
fdescribe(`when getting a type that does not exist given the common namespace and ${UnknownClass.name} class`, () => {
    let error = null;
    beforeAll(() => {
        try {
            Type.get('common', UnknownClass);
        } catch (err) {
            error = err;
        }
    });
    it('should raise an error', () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(`type not found: ${JSON.stringify({ namespace: 'common', Class: UnknownClass.name })}`);
    });
});