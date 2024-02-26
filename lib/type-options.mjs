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
        throw new Error(`no properties that match expression: ${this._exp}`);
    }
}
let getter = new PropertyRegEx(`returnProperty\\.get\\(\\{[a-zA-Z0-9\\:null]+\\}\\,[\\w]+\\,[\\w]+\\)`);
let setter = new PropertyRegEx(`Property\\.set\\(\\{[a-zA-Z0-9\\:value]+\\}\\,[\\w]+\\,[\\w]+\\)`);
let propertyType = new PropertyRegEx(`(?<=\\}\\,)[\\w]+(?=\\,)`);
export class TypeOptions {
    /**
     * @returns { PropertyRegEx }
    */
    get getterRegEx() {
        return getter;
    }
    /**
     * @param { PropertyRegEx } value
    */
    set getterRegEx(value) {
        getter = value;
    }
    /**
     * @returns { PropertyRegEx }
    */
    get setterRegEx() {
        return setter;
    }
    /**
     * @param { PropertyRegEx } value
    */
    set setterRegEx(value) {
        setter = value;
    }
    /**
     * @returns { PropertyRegEx }
    */
    get propertyTypeRegEx() {
        return propertyType;
    }
    /**
     * @param { PropertyRegEx } value
    */
    set propertyTypeRegEx(value) {
        propertyType = value;
    }
}