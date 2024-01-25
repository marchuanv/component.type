import { GUID } from "../registry.mjs";
const privateBag = new WeakMap();
class Entry {
    /**
     * @param { GUID } Id
     * @param { class } ctorArgsClass
     * @param { class} targetClass
    */
    constructor(Id, ctorArgsClass, targetClass) {
        privateBag.set(this, { Id, ctorArgsClass, targetClass });
        privateBag.get(Entry).push(this);
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
     * @param { { Id: GUID, ctorArgsClass: class, targetClass: class } } criteria
     * @returns { Entry }
    */
    static find(criteria) {
        const { Id, ctorArgsClass, targetClass } = criteria;
        return privateBag.get(Entry).find(reg =>
            (Id && reg.Id === Id) ||
            (targetClass && reg.targetClass === targetClass) ||
            (ctorArgsClass && reg.ctorArgsClass === ctorArgsClass)
        );
    }
}
privateBag.set(Entry, []);
export class CtorArgsRegistry {
    /**
     * @param { GUID } Id
     * @param { class } ctorArgsClass
     * @param { class } targetClass
    */
    static register(Id, ctorArgsClass, targetClass) {
        const prototypes = getAllPrototypes(ctorArgsClass);
        if (!prototypes.find(p => p === CtorArgs)) {
            throw new Error(`ctorArgsClass argument is not of type or extends ${CtorArgs.name}`);
        }
        new Entry(Id, ctorArgsClass, targetClass);
    }
}
privateBag.set(CtorArgsRegistry, []);
export class CtorArgs {
    constructor() {
        const target = new.target;
        if (target === CtorArgs.prototype || target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        const found = Entry.find({ ctorArgsClass: target });
        if (!found) {
            throw new Error(`${target.name} was not registered`);
        }
        privateBag.get(CtorArgsRegistry).push(found);
        privateBag.set(this, { properties: {} });
    }
    set(property) {
        const key = Object.keys(property)[0];
        const value = property[key];
        const { properties } = privateBag.get(this);
        properties[key] = value;
    }
    get(property) {
        const key = Object.keys(property)[0];
        const { properties } = privateBag.get(this);
        return properties[key];
    }
    /**
     * @returns { Array<String> }
    */
    getProperties() {
        const { properties } = privateBag.get(this);
        const propertyKeys = [];
        for (const key of Object.keys(properties)) {
            const value = Reflect.get(this, key);
            propertyKeys.push({ key, value });
        }
        return propertyKeys;
    }
    /**
     * @returns { Array<Entry> }
    */
    getMetadata() {
        return privateBag.get(CtorArgsRegistry);
    }
}
/**
 * @param { class } Class
*/
function getAllPrototypes(Class) {
    let extended = [Class];
    let prototype = Object.getPrototypeOf(Class);
    while (prototype) {
        extended.push(prototype);
        prototype = Object.getPrototypeOf(prototype);
    }
    return extended;
}