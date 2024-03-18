import { UnknownType } from 'component.uuid';
import {
    PropertiesTypeRegister,
    PropertyTypeRegister,
    Reflection,
    Type
} from '../registry.mjs';
export class TypeRegisterEntry extends PropertiesTypeRegister {
    /**
     * @param { class } targetClass
    */
    constructor(targetClass) {
        if (targetClass === null || targetClass === undefined || !Reflection.isClass(targetClass)) {
            throw new Error(`The targetClass argument is null, undefined or not a class.`);
        }
        const properties = Reflection.getClassMetadata(targetClass).filter(x => x.isProperty);
        let propertyTypeRegisterArray = properties.filter(x => x.isGetter).map(({ name }) => {
            const beforeConditions = [
                { order: 1, variable: 'super\\.' },
                { order: 2, variable: 'get' },
                { order: 3, variable: `\\(\\{${name}\\:null\\}\\,` }
            ];
            const afterConditions = [
                { order: 1, variable: '\\)' }
            ];
            let property = Reflection.getClassProperty(targetClass, name, beforeConditions, afterConditions);
            const propertyType = (new Type()).get({ name: property.propertyType });
            const propertyName = name;
            if (propertyType === UnknownType) {
                throw new Error(`${propertyName} property type is unknown.`);
            }
            const { type } = propertyType;
            return new PropertyTypeRegister(targetClass, propertyName, type, true, false);
        });
        propertyTypeRegisterArray = propertyTypeRegisterArray.concat(properties.filter(x => x.isSetter).map(({ name }) => {
            const beforeConditions = [
                { order: 1, variable: 'super\\.' },
                { order: 2, variable: 'set' },
                { order: 3, variable: `\\(\\{${name}\\:value\\}\\,` }
            ];
            const afterConditions = [
                { order: 1, variable: '\\)' }
            ];
            let property = Reflection.getClassProperty(targetClass, name, beforeConditions, afterConditions);
            const propertyType = (new Type()).get({ name: property.propertyType });
            const propertyName = name;
            if (propertyType === UnknownType) {
                throw new Error(`${propertyName} property type is unknown.`);
            }
            const { type } = propertyType;
            return new PropertyTypeRegister(targetClass, propertyName, type, true, false);
        }));
        super(propertyTypeRegisterArray, targetClass);
        const { associations } = super.get();
        if (associations === null || associations === undefined) {
            super.set(null, {});
        }
    }
}