import { EventEmitter } from './registry.mjs';
const privateBag = new WeakMap();
export class Properties {
    constructor() {
        privateBag.set(this, {
            bag: new Map(),
            event: new EventEmitter()
        });
        Object.seal(this);
    }
    /**
     * @param { Function } callback
    */
    onChange(propertyName, callback) {
        const { event } = privateBag.get(this);
        event.on(propertyName, ({ bag, value }) => {
            const newValue = callback(value);
            if (newValue !== undefined) {
                bag.set(propertyName, newValue);
            }
        });
    }
    /**
     * @param { String } propertyName
     * @param { Object } propertyValue
    */
    set(propertyName, propertyValue) {
        const { bag, event } = privateBag.get(this);
        bag.set(propertyName, propertyValue);
        event.emit(propertyName, { bag, value: propertyValue });
    }
    /**
     * @param { String } propertyName
    */
    get(propertyName) {
        const { bag } = privateBag.get(this);
        return bag.get(propertyName);
    }
}