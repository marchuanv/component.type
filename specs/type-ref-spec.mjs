import { TypeReference } from '../../utils/registry.mjs';
describe('Type Reference Specifiction Test: ', () => {
    describe('when creating a valid type reference', () => {
        let typeRef = null;
        let nsRef = null;
        beforeAll(() => {
            typeRef = new TypeReference('components', 'ClassA');
        });
        it('should reference the components namespace', () => {
            expect(nsRef).toBeDefined();
            expect(nsRef).not.toBeNull();
            expect(nsRef.namespace).toBeDefined();
            expect(nsRef.namespace).not.toBeNull();
            expect(nsRef.namespace).toBe('components');
        });
        it('should return a string representation of the type reference', () => {
            expect(typeRef).toBeDefined();
            expect(typeRef).not.toBeNull();
            expect(typeRef.metadata).toBeDefined();
            expect(typeRef.metadata).not.toBeNull();
            expect(typeRef.metadata.typeName).toBeDefined();
            expect(typeRef.metadata.typeName).not.toBeNull();
            expect(typeRef.toString()).toBe('ClassA');
        });
    });

    //namespace tests
    describe('when creating a type reference given the namespace is null', () => {
        let error = null;
        beforeAll(() => {
            try {
                new TypeReference(null, 'ClassA');
            } catch (err) {
                console.log(err);
                error = err;
            }
        });
        it('should raise an error', () => {
            expect(error).toBeDefined();
            expect(error).not.toBeNull();
            expect(error.message).toBeDefined();
            expect(error.message).not.toBeNull();
            expect(error.message).toBe('The namespace argument is null, undefined, or empty.');
        });
    });
    describe('when creating a type reference given the namespace is undefined', () => {
        let error = null;
        beforeAll(() => {
            try {
                new TypeReference(undefined, 'ClassA');
            } catch (err) {
                console.log(err);
                error = err;
            }
        });
        it('should raise an error', () => {
            expect(error).toBeDefined();
            expect(error).not.toBeNull();
            expect(error.message).toBeDefined();
            expect(error.message).not.toBeNull();
            expect(error.message).toBe('The namespace argument is null, undefined, or empty.');
        });
    });
    describe(`when creating a type reference given the namespace is not a string`, () => {
        let error = null;
        beforeAll(() => {
            try {
                new TypeReference({}, 'ClassA');
            } catch (err) {
                console.log(err);
                error = err;
            }
        });
        it('should raise an error', () => {
            expect(error).toBeDefined();
            expect(error).not.toBeNull();
            expect(error.message).toBeDefined();
            expect(error.message).not.toBeNull();
            expect(error.message).toBe('The namespace argument is not a string.');
        });
    });

    //typeName tests
    describe(`when creating a type reference given the typeName is empty`, () => {
        let error = null;
        beforeAll(() => {
            try {
                new TypeReference('components', '');
            } catch (err) {
                console.log(err);
                error = err;
            }
        });
        it('should raise an error', () => {
            expect(error).toBeDefined();
            expect(error).not.toBeNull();
            expect(error.message).toBeDefined();
            expect(error.message).not.toBeNull();
            expect(error.message).toBe('The typeName argument is null, undefined, or empty.');
        });
    });
    describe(`when creating a type reference given the typeName is null`, () => {
        let error = null;
        beforeAll(() => {
            try {
                new TypeReference('components', null);
            } catch (err) {
                console.log(err);
                error = err;
            }
        });
        it('should raise an error', () => {
            expect(error).toBeDefined();
            expect(error).not.toBeNull();
            expect(error.message).toBeDefined();
            expect(error.message).not.toBeNull();
            expect(error.message).toBe('The typeName argument is null, undefined, or empty.');
        });
    });
    describe(`when creating a type reference given the typeName is undefined`, () => {
        let error = null;
        beforeAll(() => {
            try {
                new TypeReference('components', undefined);
            } catch (err) {
                console.log(err);
                error = err;
            }
        });
        it('should raise an error', () => {
            expect(error).toBeDefined();
            expect(error).not.toBeNull();
            expect(error.message).toBeDefined();
            expect(error.message).not.toBeNull();
            expect(error.message).toBe(`The typeName argument is null, undefined, or empty.`);
        });
    });
    describe(`when creating a type reference given the typeName is not a ${String.name}`, () => {
        let error = null;
        beforeAll(() => {
            try {
                new TypeReference('components', {});
            } catch (err) {
                console.log(err);
                error = err;
            }
        });
        it('should raise an error', () => {
            expect(error).toBeDefined();
            expect(error).not.toBeNull();
            expect(error.message).toBeDefined();
            expect(error.message).not.toBeNull();
            expect(error.message).toBe('The typeName argument is not a string.');
        });
    });
});