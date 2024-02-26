export class PropertyRegEx {
    /**
     * @param { String } expressionStr 
    */
    constructor(expressionStr) {
        if (new.target !== PropertyRegEx) {
            throw new Error(`${PropertyRegEx.name} is a sealed class.`);
        }
        this._exp = new RegExp(expressionStr);
    }
    /**
     * @param { String } str
     * @returns { String }
    */
    get(str) {
        this._exp.lastIndex = 0;
        const match = this._exp.exec(str);
        if (match) {
            return match[0];
        }
        return null;
    }
    static get DefaultGetterRegEx() {
        return new PropertyRegEx(`returnProperty\\.get\\(\\{[a-zA-Z0-9\\:null]+\\}\\,[\\w]+\\)`);
    }
    static get DefaultSetterRegEx() {
        return new PropertyRegEx(`Property\\.set\\(\\{[a-zA-Z0-9\\:value]+\\}\\,[\\w]+\\)`);
    }
}