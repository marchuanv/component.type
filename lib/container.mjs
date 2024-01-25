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
        for (const entry of ctorArgs.getMetadata()) {
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
        const getMetadata = (obj) => {
            return Object.keys(obj).reduce((_obj, key) => {
                const value = obj[key];
                if (typeof value === 'object' && !Array.isArray(value)) {
                    if (key === 'metadata') {
                        for (const _metaKey of Object.keys(obj[key])) {
                            _obj[_metaKey] = obj[key][_metaKey];
                        }
                    } else {
                        const obj2 = getMetadata(value) || {};
                        const _metaKey = Object.keys(obj2)[0];
                        _obj[_metaKey] = obj2[_metaKey];
                    }
                }
                return _obj;
            }, {});
        };
        const _allCtorArgsMetadata = getMetadata(_ctorArgs);
        const _ctorArgsClassId = _allCtorArgsMetadata[ctorArgsClass.name];
        const ctorArgs = new ctorArgsClass();
        const prototypes = ctorArgs.getMetadata();

        Object.freeze(ctorArgs);

        for (const key of Object.keys(_ctorArgs).filter(key => key !== 'metadata')) {
            const value = _ctorArgs[key];
            if (value.metadata) {
                const keys = Object.keys(value.metadata);
                for (const key2 of keys) {
                    const ctorArgClass = prototypes.find(p => p.Id.toString() === value.metadata[key2]);
                    console.log();
                }
            }
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