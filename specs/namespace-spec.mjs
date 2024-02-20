import { Namespace, GUID } from '../registry.mjs';
describe('when creating a namespace', () => {
    it('should compare and equal two namespaces with the same names', () => {
        const id = new Namespace('part1');
        const id2 = new Namespace('part1');
        expect(id).toBeDefined();
        expect(id).not.toBeNull();
        expect(id2).toBeDefined();
        expect(id2).not.toBeNull();
        expect(id).toBe(id2);
    });
    it('should compare and equal two namespaces with different names', () => {
        const id = new GUID('part2');
        const id2 = new GUID('part2');
        expect(id).toBeDefined();
        expect(id).not.toBeNull();
        expect(id2).toBeDefined();
        expect(id2).not.toBeNull();
        expect(id).not.toBe(id2);
    });
});