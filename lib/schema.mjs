import {
    GUID, TypeDefinition,
    VERBOSE,
    fileURLToPath, join,
    readFileSync,
    registerSchema,
    validateSchema,
    walkDir
} from "../registry.mjs";
const privateBag = new WeakMap();
export class Schema {
    /**
     * @param { GUID } typeId
     * @param { String } typeName
     * @param { String } title
     * @param { String } type
     * @param { Object } properties
     * @param { Array<String> } required
    */
    constructor(typeId, typeName, title, type, properties, required) {
        const targetClass = new.target;
        if (targetClass !== Schema.prototype && targetClass !== Schema) {
            throw new Error(`${Schema.name} class is abstract`);
        }
        const schema = {
            "$id": `https://${typeId}/${typeName}`,
            "$schema": 'https://json-schema.org/draft/2020-12/schema',
            title,
            type,
            properties,
            required
        };
        registerSchema(schema);
        privateBag.set(this, schema);
        privateBag.get(Schema).push(this);
    }
    get url() {
        const { $id } = privateBag.get(this);
        return $id;
    }
    get definition() {
        const schema = privateBag.get(this);
        return JSON.parse(JSON.stringify(schema));
    }
    /**
     * @param { Object } obj
    */
    async validate(obj) {
        let output = null;
        try {
            output = await validateSchema(this.url, obj, VERBOSE);
            if (!output.valid) {
                throw new Error(`container does not conform to schema: ${this.url}`);
            }
        } catch (error) {
            output = error.output ? error.output : output;
            if (output && output.errors) {
                const messages = [];
                walkSchemaErrorTree(output.errors, (message, depth) => {
                    delete message.errors;
                    messages.push({ depth, message });
                });
                throw new Error(JSON.stringify(messages, null, 4));
            } else {
                throw error;
            }
        }
    }
    /**
     * @param { TypeDefinition } typeDefinition
     * @returns { Schema }
    */
    static getSchema(typeDefinition) {
        const { Id, typeName } = typeDefinition;
        return Schema.findSchema({ typeId: Id, typeName });
    }
    /**
     * @param {{ typeId: String, typeName: String } } criteria
     * @returns { Schema }
    */
    static findSchema(criteria) {
        const { typeId, typeName } = criteria;
        const urlMatch = `https://${typeId}/${typeName.toLowerCase()}`;
        return privateBag.get(Schema).find(s => s.url === urlMatch);
    }
    /**
     * @param { TypeDefinition } classInterface
     * @param { Object } properties
     * @returns { Schema }
    */
    static createSchema(typeDefinition, properties) {
        const { Id, typeName, name, isNative } = typeDefinition;
        const required = Object.keys(properties);
        if (isNative) {
            return new Schema(new GUID(Id), name, typeName, name, properties, required);
        } else {
            return new Schema(new GUID(Id), name, typeName, 'object', properties, required);
        }
    }
}
privateBag.set(Schema, []);
const currentDir = fileURLToPath(new URL('./', import.meta.url));
const schemasDirPath = join(currentDir, 'schemas');
walkDir(schemasDirPath, (filePath) => {
    if (filePath.endsWith('.schema.json')) {
        const { $id, title, type, properties, required } = JSON.parse(readFileSync(filePath));
        const split = $id.split('/');
        const guid = split[2];
        const className = split[3];
        new Schema(new GUID(guid), className, title, type, properties, required);
    }
});
for (const typeDef of TypeDefinition.types) {
    Schema.createSchema(typeDef, {});
}
function walkSchemaErrorTree(errors, callback, depth = 0) {
    for (const error of errors) {
        if (error.errors.length > 0) {
            walkSchemaErrorTree(error.errors, callback, depth + 1);
        }
        if (!error.valid) {
            callback(error, depth);
        }
    }
}
