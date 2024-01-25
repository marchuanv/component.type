import {
    CtorArgs, CtorArgsRegistry
} from '../registry.mjs';
const privateBag = new WeakMap();
class ContainerField {
    /**
     * @param { String } name
     * @param { Object } value
     * @param { Boolean } isReadOnly
     */
    constructor(name, value, isPrivate = true) {
        privateBag.set(this, { name, value, isPrivate });
    }
    /**
     * @returns { String }
    */
    get name() {
        const { name } = privateBag.get(this);
        return name;
    }
    /**
     * @returns { Object }
    */
    get value() {
        const { value } = privateBag.get(this);
        return value;
    }
    /**
     * @returns { Boolean }
    */
    get isPrivate() {
        const { isPrivate } = privateBag.get(this);
        return isPrivate;
    }
}

export class Container {
    /**
     * @param { CtorArgs } ctorArgs
    */
    constructor(ctorArgs) {
        let targetClass = new.target;
        if (targetClass === Container.prototype || targetClass === Container) {
            throw new Error(`${Container.name} class is abstract`);
        }
        Object.freeze(ctorArgs);
        if (!(ctorArgs instanceof CtorArgs)) {
            throw new Error(`ctorArgs is not an instance of ${CtorArgs.name}`);
        }
        const fields = [];
        const ctorArgsMetadata = CtorArgsRegistry.metadata.find(md => md.targetClass === targetClass);
        for (const key of Object.keys(ctorArgsMetadata.properties)) {
            const value = ctorArgs[key];
            if (value === undefined || value === null) {
                throw new Error(`${key} ctor parameter is null or undefined`);
            }
            const field = new ContainerField(key, value, true);
            fields.push(field);
        }
        privateBag.set(this, { fields });
        Object.freeze(this);
    }
    /**
     * @param { Object } property
    */
    set(property) {
        const field = getField.call(this, property);
        const { name, value, isPrivate } = field;
        if (isPrivate) {
            throw new Error(`${name} field is private`);
        }
        field.value = value;
    }
    /**
     * @return { Object }
    */
    get(property) {
        const { value } = getField.call(this, property);
        return value;
    }
    serialise() {
        const { fields } = privateBag.get(this);
        const privateFields = fields.filter(field => field.isPrivate);
        const instance = {};
        let data = [instance];
        for (const { Id } of CtorArgsRegistry.metadata.filter(md => this.constructor === md.targetClass)) {
            instance.metadataId = Id.toString();
            instance.args = {};
            for (const field of privateFields) {
                let value = field.value;
                if (field.value instanceof Container) {
                    let _data = this.serialise.call(field.value);
                    _data = JSON.parse(_data);
                    data = data.concat(_data);
                    instance.args[field.name] = {
                        "$ref": _data[0].metadataId
                    };
                } else {
                    instance.args[field.name] = value;
                }
            }
        }
        return JSON.stringify(data);
    }
    /**
     * @template T
     * @param { String } data
     * @returns { T }
    */
    static async deserialise(data) {
        const metadata = CtorArgsRegistry.metadata;
        const _data = JSON.parse(data);
        let instance = _data.shift();
        const { metadataId, args } = instance;
        const { targetClass, ctorArgsClass, properties } = metadata.find(md => md.Id.toString() === metadataId);
        const refKeys = Object.keys(args).filter(key => args[key]['$ref']);
        for (const refKey of refKeys) {
            const { $ref } = args[refKey];
            const _data2 = _data.find(x => x.metadataId === $ref);
            args[refKey] = await this.deserialise(JSON.stringify([_data2]));
        }
        const ctorArgs = new ctorArgsClass();
        for (const key of Object.keys(properties)) {
            ctorArgs[key] = args[key];
        }
        return Reflect.construct(targetClass, [ctorArgs]);
    }
}
/**
 * @param { Object } property
 * @returns { PrivateField }
*/
function getField(property) {
    const { fields } = privateBag.get(this);
    const key = Object.keys(property)[0];
    let field = fields.find(field => field.name === key);
    if (!field) {
        field = new ContainerField(key, null, false);
        fields.push(field);
    }
    return field;
}