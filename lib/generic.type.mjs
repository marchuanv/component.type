const privateBag = new WeakMap();
export class GenericType {
    /**
     * @param { class } type
     */
    constructor(type) {
        privateBag.set(this, type);
    }
    /**
     * @template T
     * @param { T } type
     * @returns { T }
    */
    type(type) {
        return privateBag.get(this);
    }
}