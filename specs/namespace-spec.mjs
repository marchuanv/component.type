import { Namespace } from '../registry.mjs';
describe('when creating a valid namespace', () => {
    it('should have equality between two namespaces with the same names', () => {
        const id = new Namespace('part1');
        const id2 = new Namespace('part1');
        expect(id).toBeDefined();
        expect(id).not.toBeNull();
        expect(id2).toBeDefined();
        expect(id2).not.toBeNull();
        expect(id).toBe(id2);
    });
    it('should not have equality between two namespaces with different names', () => {
        const id = new Namespace('part2');
        const id2 = new Namespace('part2');
        expect(id).toBeDefined();
        expect(id).not.toBeNull();
        expect(id2).toBeDefined();
        expect(id2).not.toBeNull();
        expect(id).not.toBe(id2);
    });
});
describe('when creating an invalid namespace given a namespace of "part.$##@.%#$%"', () => {
    let error = null;
    beforeAll(() => {
        try {
            new Namespace('part.$##@.%#$%');
        } catch (err) {
            error = err;
        }
    });
    it('should raise an error', () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error.message).toBe('The namespace argument does not adhering to typical naming conventions: requires optional "@" prefixes and multiple segments separated by dots.')
    });
});