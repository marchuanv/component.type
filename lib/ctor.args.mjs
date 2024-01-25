import { GUID } from "../registry.mjs";
const privateBag = new WeakMap();
class Metadata {
    /**
     * @param { GUID } Id
     * @param { class } ctorArgsClass
     * @param { class} targetClass
     * @param { Array<PropertyKey> } properties
    */
    constructor(Id, ctorArgsClass, targetClass, properties) {
        privateBag.set(this, { Id, ctorArgsClass, targetClass, properties });
        privateBag.get(Metadata).push(this);
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        const { Id } = privateBag.get(this);
        return Id;
    }
    /**
     * @returns { class }
    */
    get ctorArgsClass() {
        const { ctorArgsClass } = privateBag.get(this);
        return ctorArgsClass;
    }
    /**
     * @returns { class }
    */
    get targetClass() {
        const { targetClass } = privateBag.get(this);
        return targetClass;
    }
    /**
     * @returns { Array<PropertyKey> }
    */
    get properties() {
        const { properties } = privateBag.get(this);
        return properties;
    }
    /**
     * @param { { Id: GUID, ctorArgsClass: class, targetClass: class } } criteria
     * @returns { Metadata }
    */
    static find(criteria) {
        const { Id, ctorArgsClass, targetClass } = criteria;
        return privateBag.get(Metadata).find(reg =>
            (Id && reg.Id === Id) ||
            (targetClass && reg.targetClass === targetClass) ||
            (ctorArgsClass && reg.ctorArgsClass === ctorArgsClass)
        );
    }
}
privateBag.set(Metadata, []);
export class CtorArgsRegistry {
    /**
     * @param { GUID } Id
     * @param { class } ctorArgsClass
     * @param { class } targetClass
    */
    static register(Id, ctorArgsClass, targetClass) {
        const prototypes = getExtendedCtorArgs(ctorArgsClass);
        const allProperties = {};
        for (const prototype of prototypes) {
            let properties = Object.getOwnPropertyDescriptors(prototype.prototype);
            properties = Object.keys(properties).filter(key => properties[key].get || properties[key].set);
            for (const propertyName of properties) {
                allProperties[propertyName] = null;
            }
        }
        new Metadata(
            Id,
            ctorArgsClass,
            targetClass,
            allProperties
        );
    }
    /**
     * @returns { Array<Metadata> }
    */
    static get metadata() {
        return privateBag.get(Metadata);
    }
}
privateBag.set(CtorArgsRegistry, []);
export class CtorArgs {
    constructor() {
        const target = new.target;
        if (target === CtorArgs.prototype || target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        const metadata = Metadata.find({ ctorArgsClass: target });
        const properties = JSON.parse(JSON.stringify(metadata.properties));
        privateBag.set(this, { properties });
    }
    /**
     * @param { Object } property
    */
    set(property) {
        const { properties } = privateBag.get(this);
        const key = Object.keys(property)[0];
        if (properties[key] === undefined) {
            throw new Error(`${key} property not found.`);
        }
        const value = property[key];
        properties[key] = value;
    }
    /**
     * @return { Object }
    */
    get(property) {
        const { properties } = privateBag.get(this);
        const key = Object.keys(property)[0];
        if (properties[key] === undefined) {
            throw new Error(`${key} property not found.`);
        }
        return properties[key];
    }
}
/**
 * @param { class } Class
*/
function getExtendedCtorArgs(Class) {
    let extended = [Class];
    let prototype = Object.getPrototypeOf(Class);
    while (prototype) {
        extended.push(prototype);
        if (prototype === CtorArgs) {
            break;
        }
        prototype = Object.getPrototypeOf(prototype);
    }
    if (!extended.find(p => p === CtorArgs)) {
        throw new Error(`${Class.name} does not extend ${CtorArgs.name}`);
    }
    return extended;
}