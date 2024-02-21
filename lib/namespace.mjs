import { GUID } from '../registry.mjs';
const REGEX_ROOT = /(?<=\w)[\.]+[a-zA-Z0-9]+(?=\;)/;
const REGEX_NON_ROOT = /(?<=\w)[\.]+[a-zA-Z0-9]+(?=\;)/;
const REGEX_FULL_NAMESPACE = /^(@?[a-z_A-Z]\w+(?:\.@?[a-z_A-Z]\w+)*)$/;
const privateBag = new WeakMap();
export class Namespace {
    /**
     * @param { String } namespace
    */
    constructor(namespace) {
        REGEX_ROOT.lastIndex = 0;
        REGEX_NON_ROOT.lastIndex = 0;
        REGEX_FULL_NAMESPACE.lastIndex = 0;
        let match = REGEX_FULL_NAMESPACE.exec(namespace);
        if (match) {
            const parts = match[0].split('.');
            let namespace = '';
            if (parts.length === 1) {
                namespace = parts[0];
            } else {
                for (const part of parts) {
                    namespace = `${namespace}.${part}`;
                }
            }
            const Id = new GUID({ namespace });
            if (privateBag.has(Id)) {
                return privateBag.get(Id);
            } else {
                privateBag.set(Id, this);
            }
            privateBag.set(this, Id);
        } else {
            throw new Error('The namespace argument does not adhering to typical naming conventions: requires optional "@" prefixes and multiple segments separated by dots.');
        }
    }
    toString() {
        return privateBag.get(this).toString();
    }
}