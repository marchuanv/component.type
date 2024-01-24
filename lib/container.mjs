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
        for (const { key, value } of ctorArgs.properties) {
            if (value === undefined || value === null) {
                throw new Error(`${key} ctor argument is null or undefined`);
            }
        }
        privateBag.set(this, ctorArgs);
        Object.freeze(this);
    }
    async serialise() {
        const ctorArgs = privateBag.get(this);
        for (const { key, value } of ctorArgs.properties) {
            if (value instanceof Container) {
                const serialisedStr = await value.serialise();
                ctorArgs[key] = JSON.parse(serialisedStr);
            }
        }
        const obj = ctorArgs.properties.reduce((_obj, { key, value }) => {
            _obj[key] = value;
            return _obj;
        }, {});
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
        const ctorArgs = new ctorArgsClass();
        Object.freeze(ctorArgs);
        const _ctorArgs = JSON.parse(ctorArgsStr);
        for (const key of Object.keys(_ctorArgs)) {
            const value = _ctorArgs[key];
            ctorArgs[key] = value;
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