export class CtorArgs {
    /**
     * @param { Script } script
     */
    constructor() {
        if (new.target === CtorArgs.prototype || new.target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
    }
}