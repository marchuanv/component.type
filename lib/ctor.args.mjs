import { GUID } from "../registry.mjs";
const privateBag = new WeakMap();
class Entry {
    /**
     * @param { GUID } Id
     * @param { class} targetClass
    */
    constructor(Id, targetClass) {
        privateBag.set(this, { Id, targetClass });
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
    get targetClass() {
        const { targetClass } = privateBag.get(this);
        return targetClass;
    }
    /**
     * @param { { Id: GUID, targetClass: class } } criteria
     * @returns { Entry }
    */
    static find(criteria) {
        const { Id, targetClass } = criteria;
        return privateBag.get(Entry).find(reg =>
            (Id && reg.Id === Id) || (targetClass && reg.targetClass === targetClass)
        );
    }
}
privateBag.set(Entry, []);
export class CtorArgsRegistry {
    /**
     * @param { GUID } Id
     * @param { class } targetClass
    */
    static register(Id, targetClass) {
        const prototypes = getAllPrototypes(targetClass);
        if (!prototypes.find(p => p === CtorArgs)) {
            throw new Error(`targetClass argument is not of type or extends ${CtorArgs.name}`);
        }
        new Entry(Id, targetClass);
    }
}
export class CtorArgs {
    constructor() {
        const target = new.target;
        if (target === CtorArgs.prototype || target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        const _prototypes = [];
        const prototypes = getAllPrototypes(target);
        let targetClass = prototypes.shift();
        while (targetClass) {
            if (targetClass === CtorArgs) {
                break;
            }
            const found = Entry.find({ targetClass });
            if (!found) {
                throw new Error(`${targetClass.name} was not registered`);
            }
            _prototypes.push(found);
            targetClass = prototypes.shift();
        }
        privateBag.set(this, { properties: {}, prototypes: _prototypes });
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
        const { prototypes } = privateBag.get(this);
        return prototypes;
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