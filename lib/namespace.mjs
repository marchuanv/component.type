import { GUID } from '../registry.mjs';
const REGEX_ROOT = /(?<=\w)[\.]+[a-zA-Z0-9]+(?=\;)/;
const REGEX_NON_ROOT = /(?<=\w)[\.]+[a-zA-Z0-9]+(?=\;)/;
const privateBag = new WeakMap();
export class Namespace {
    /**
     * @param { String } namespace
    */
    constructor(namespace) {
        REGEX_ROOT.lastIndex = 0;
        REGEX_NON_ROOT.lastIndex = 0;
        let match = REGEX_ROOT.exec(namespace);
        if (!match) {
            throw new Error('invalid namespace.');
        }
        let root = match[0];
        match = REGEX_NON_ROOT.exec(namespace);
        if (!match) {
            throw new Error('invalid namespace.');
        }
        const Id = new GUID({ namespace });
        privateBag.set(this, Id);
    }
    toString() {
        return privateBag.get(this);
    }
}