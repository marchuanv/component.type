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