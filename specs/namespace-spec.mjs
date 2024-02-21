import { Namespace } from '../registry.mjs';
describe('when creating a valid namespace', () => {
    it('should have equality between two of the same namespaces', () => {
        const id = new Namespace('segment1');
        const id2 = new Namespace('segment1');
        expect(id).toBeDefined();
        expect(id).not.toBeNull();
        expect(id2).toBeDefined();
        expect(id2).not.toBeNull();
        expect(id).toBe(id2);
        expect(id).toEqual(id2);
    });
    it('should not have equality between two different namespaces', () => {
        const id = new Namespace('segment1.segment1');
        const id2 = new Namespace('segment1.segment2');
        expect(id).toBeDefined();
        expect(id).not.toBeNull();
        expect(id2).toBeDefined();
        expect(id2).not.toBeNull();
        expect(id).not.toBe(id2);
        expect(id).toEqual(id2);
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