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
        privateBag.set(this, ctorArgs);
        Object.freeze(this);
    }
    async serialise() {
        const ctorArgs = privateBag.get(this);
        for (const paramName of Object.keys(ctorArgs)) {
            const paramValue = ctorArgs[paramName];
            if (paramValue instanceof Container) {
                const instance = paramValue;
                const serialisedStr = await instance.serialise();
                ctorArgs[paramName] = JSON.parse(serialisedStr);
            }
        }
        const obj = Object.keys(ctorArgs).reduce((_obj, paramName) => {
            _obj[paramName] = ctorArgs[paramName];
            return _obj;
        }, {});
        return JSON.stringify(obj);
    }
    /**
     * @template T
     * @param { String } data
     * @param { T } targetClass
     * @returns { T }
    */
    static async deserialise(data, targetClass) {
        if (!(targetClass instanceof CtorArgs)) {
            throw new Error(`targetClass is not an instance of ${CtorArgs.name}`);
        }
        return Reflect.construct(targetClass, JSON.parse(data));
    }
}