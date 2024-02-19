import { Reference } from '../../utils/registry.mjs';
describe('Reference Specifiction Test: ', () => {
    describe('when creating a reference given an empty namespace', () => {
        let refId = null;
        let ref = null;
        let error = null;
        beforeAll(() => {
            try {
                ref = new Reference('');
                ({ Id: refId } = ref);
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
            expect(error.message).toBe('The namespace argument is null, undefined or empty.');
        });
    });
    describe('when creating a reference given an null namespace', () => {
        let refId = null;
        let ref = null;
        let error = null;
        beforeAll(() => {
            try {
                ref = new Reference(null);
                ({ Id: refId } = ref);
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
            expect(error.message).toBe('The namespace argument is null, undefined or empty.');
        });
    });
    describe('when creating a reference given an undefined namespace', () => {
        let refId = null;
        let ref = null;
        let error = null;
        beforeAll(() => {
            try {
                ref = new Reference(undefined);
                ({ Id: refId } = ref);
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
            expect(error.message).toBe('The namespace argument is null, undefined or empty.');
        });
    });
    describe('when finding references', () => {
        let A_Id = null;
        let B_Id = null;
        let C_Id = null;
        let A = null;
        let B = null;
        let C = null;

        beforeAll(() => {
            A = new Reference('ReferenceSpecs');
            ({ Id: A_Id } = A);
            A.metadata.isRoot = true;

            B = new Reference('ReferenceSpecs', A_Id);
            ({ Id: B_Id } = B);

            C = new Reference('ReferenceSpecs', B_Id);
            ({ Id: C_Id } = C);
        });

        it('B should reference A', () => {
            const isRef = B.isAssociatedWith(A_Id);
            expect(isRef).toBeTrue();
        });

        it('A should reference B', () => {
            const isRef = A.isAssociatedWith(B_Id);
            expect(isRef).toBeTrue();
        });

        it('B should reference C', () => {
            const isRef = B.isAssociatedWith(C_Id);
            expect(isRef).toBeTrue();
        });

        it('C should reference B', () => {
            const isRef = C.isAssociatedWith(B_Id);
            expect(isRef).toBeTrue();
        });

        it('should have metadata', () => {
            const references = Array.from(Reference.nextRef());
            const allMetadata = references.filter(ref => ref.metadata);
            expect(allMetadata.length).toBe(references.length);
        });

        it('should return an iterator over all references including the root', () => {
            const references = Array.from(Reference.nextRef());
            const hasRoot = references.some(ref => ref.metadata.isRoot);
            expect(hasRoot).toBeTrue();
            const referenceIds = references.map(ref => ref.Id.toString());
            expect(referenceIds).toContain(A_Id.toString());
            expect(referenceIds).toContain(B_Id.toString());
            expect(referenceIds).toContain(C_Id.toString());
            expect(referenceIds.length).toBe(3);
        });
    });
});