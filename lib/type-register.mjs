import { GUID, Store, TypeInfo, TypeRegisterSchema } from '../registry.mjs';
const secureContext = new GUID();
export class TypeRegister extends Store {
    /**
     * @param { TypeInfo } typeInfo
     * @param { GUID } typeRegisterId
     * @param { TypeRegisterSchema } schema
     * @param { Object } metadata
    */
    constructor(typeInfo, typeRegisterId = null, schema = new TypeRegisterSchema(), metadata = {}) {
        const _typeRegisterId = typeRegisterId;
        if (
            (typeInfo === null || typeInfo === undefined || !(typeInfo instanceof TypeInfo)) &&
            (_typeRegisterId === null || _typeRegisterId === undefined || !(typeRegisterId instanceof GUID))
        ) {
            throw new Error(`The typeInfo argument is null, undefined or not an instance of ${TypeInfo.name}.`);
        }
        if (metadata !== undefined && metadata !== null && typeof metadata !== 'object' && Object.keys(metadata) === 0) {
            throw new Error('The metadata argument is not an object.');
        }
        if (schema !== null && schema !== undefined && !(schema instanceof TypeRegisterSchema)) {
            throw new Error(`The schema argument is not an instance of ${TypeRegisterSchema.name}.`);
        }
        for (const { name, typeInfo } of schema) {
            if (metadata[name] === undefined) {
                metadata[name] = typeInfo;
            }
        }
        if (typeRegisterId === null || typeRegisterId === undefined) {
            typeRegisterId = typeInfo;
            super(typeRegisterId, schema, secureContext);
            try {
                super.set(metadata, secureContext);
            } catch (error) {
                throw new Error(`unable to register ${typeInfo.name} type: Error: ${error.message}`);
            }
        } else {
            super(typeRegisterId, schema, secureContext);
            //sync with what is in the store
            const originalMetadata = super.get(secureContext);
            for (const { key } of schema) {
                metadata[key] = originalMetadata[key];
            }
        }
    }
    /**
     * @returns { TypeInfo }
    */
    get typeInfo() {
        const { typeInfo } = super.get(secureContext);
        return typeInfo;
    }
    /**
     * @returns { Object }
    */
    get extended() {
        const metadata = super.get(secureContext);
        const schema = new TypeRegisterSchema();
        const extendedMetadataKeys = Object.keys(metadata).filter(key => !schema.find(x => x.key === key));
        const extendedMetadata = {};
        for (const key of extendedMetadataKeys) {
            extendedMetadata[key] = metadata[key];
        }
        return extendedMetadata;
    }
}
// new TypeRegister(String);
// new TypeRegister(Boolean);
// new TypeRegister(Number);
// new TypeRegister(Object);
// new TypeRegister(Array);
// new TypeRegister(BigInt);
// new TypeRegister(null);
// new TypeRegister('undefined');