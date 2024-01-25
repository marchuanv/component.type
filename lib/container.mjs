import {
    CtorArgs
} from '../registry.mjs';
const privateBag = new WeakMap();
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
        for (const { key, value } of ctorArgs.getProperties()) {
            if (value === undefined || value === null) {
                throw new Error(`${key} ctor argument is null or undefined`);
            }
        }
        privateBag.set(this, ctorArgs);
        Object.freeze(this);
    }
    serialise() {
        const ctorArgs = privateBag.get(this);
        const properties = ctorArgs.getProperties();
        const obj = properties.reduce((_obj, { key, value }) => {
            if (value instanceof Container) {
                const serialisedStr = value.serialise();
                _obj[key] = JSON.parse(serialisedStr);
            } else {
                _obj[key] = value;
            }
            return _obj;
        }, {});
        obj.metadata = {};
        const allMetadata = ctorArgs.getMetadata()
            .filter(e => ctorArgs instanceof e.ctorArgsClass);
        for (const entry of allMetadata) {
            obj.metadata[entry.targetClass.name] = entry.Id.toString();
        }
        return JSON.stringify(obj);
    }
    /**
     * @template T
     * @template T2
     * @param { String } ctorArgsStr
     * @param { T } targetClass
     * @param { T2 } ctorArgsClass
     * @returns { T }
    */
    static async deserialise(ctorArgsStr, targetClass, ctorArgsClass) {
        const classPrototypes = getAllPrototypes(targetClass);
        const ctorArgsPrototypes = getAllPrototypes(ctorArgsClass);
        if (!classPrototypes.find(p => p === Container)) {
            throw new Error(`targetClass is not an instance of ${Container.name}`);
        }
        if (!ctorArgsPrototypes.find(p => p === CtorArgs)) {
            throw new Error(`ctorArgs is not an instance of ${CtorArgs.name}`);
        }
        const _ctorArgs = JSON.parse(ctorArgsStr);
        const ctorArgs = new ctorArgsClass();
        const prototypes = ctorArgs.getMetadata();
        Object.freeze(ctorArgs);
        for (const key of Object.keys(_ctorArgs).filter(key => key !== 'metadata')) {
            const value = _ctorArgs[key];
            if (value.metadata) {
                const key2 = Object.keys(value.metadata)[0];
                const found = prototypes.find(p => p.Id.toString() === value.metadata[key2]);
                if (found) {
                    const { targetClass, ctorArgsClass } = found;
                    const instance = await this.deserialise(JSON.stringify(value), targetClass, ctorArgsClass);
                    ctorArgs[key] = instance;
                }
            } else {
                ctorArgs[key] = value;
            }
        }
        return Reflect.construct(targetClass, [ctorArgs]);
    }
}
/**
 * @param { class } Class
*/
function getAllPrototypes(Class) {
    let extended = [];
    let prototype = Object.getPrototypeOf(Class);
    while (prototype) {
        extended.push(prototype);
        prototype = Object.getPrototypeOf(prototype);
    }
    return extended;
}