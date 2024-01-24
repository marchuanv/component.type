const privateBag = new WeakMap();
export class CtorArgs {
    /**
     * @param { Script } script
     */
    constructor() {
        if (new.target === CtorArgs.prototype || new.target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        privateBag.set(this, { bag: {} });
    }
    set(property) {
        const key = Object.keys(property)[0];
        const value = property[key];
        const { bag } = privateBag.get(this);
        bag[key] = value;
    }
    get(property) {
        const key = Object.keys(property)[0];
        const { bag } = privateBag.get(this);
        return bag[key];
    }
    /**
     * @returns { Array<String> }
    */
    get properties() {
        const { bag } = privateBag.get(this);
        const propertyKeys = [];
        for (const key of Object.keys(bag)) {
            const value = Reflect.get(this, key);
            propertyKeys.push({ key, value });
        }
        return propertyKeys;
    }
}