import {
    PropertiesReference,
    PropertiesTypeRegister,
    PropertyTypeRegister,
    Reflection,
    Store,
    Type,
    TypeReference,
    UnknownType,
    GUID,
    PropertyReference,
    Reference
} from '../registry.mjs';
export class TypeRegisterEntry extends PropertiesTypeRegister {
    /**
     * @param { class } targetClass
     * @param { Array<class> | class } classExtended
    */
    constructor(targetClass) {
        if (targetClass === null || targetClass === undefined || !Reflection.isClass(targetClass)) {
            throw new Error(`The targetClass argument is null, undefined or not a class.`);
        }
        const _classExtensions = Reflection.getExtendedClasses(targetClass)
            .filter(cls =>
                cls !== TypeReference &&
                cls !== Store &&
                cls !== PropertiesReference &&
                cls !== PropertyReference &&
                cls !== GUID &&
                cls !== Reference &&
                cls !== targetClass
            );
        const classes = [targetClass].concat(_classExtensions);
        let properties = classes.reduce((properties, Class) => {
            const classProperties = Reflection.getClassMetadata(Class).filter(x => x.isProperty);
            return properties.concat(classProperties);
        }, []);
        let getterProperties = properties.filter(x => x.isGetter).map(({ Class, name }) => {
            const beforeConditions = [
                { order: 1, variable: 'super\\.' },
                { order: 2, variable: 'get' },
                { order: 3, variable: `\\(\\{${name}\\:null\\}\\,` }
            ];
            const afterConditions = [
                { order: 1, variable: '\\)' }
            ];
            return Reflection.getClassProperty(Class, name, beforeConditions, afterConditions);
        });
        let setterProperties = properties.filter(x => x.isSetter).map(({ Class, name }) => {
            const beforeConditions = [
                { order: 1, variable: 'super\\.' },
                { order: 2, variable: 'set' },
                { order: 3, variable: `\\(\\{${name}\\:value\\}\\,` }
            ];
            const afterConditions = [
                { order: 1, variable: '\\)' }
            ];
            return Reflection.getClassProperty(Class, name, beforeConditions, afterConditions);
        });
        properties = getterProperties.concat(setterProperties);
        if (properties.some(prop => prop === null || prop === undefined)) {
            throw new Error(`one or more properties could not be found.`);
        }
        let duplicatePropertyIndexes = properties.map(({ classId, name }) => { //remove duplicate configurations that are NOT target class properties
            return properties.findIndex(x => x.classId !== classId && x.Class !== targetClass && x.name === name);
        }).filter(index => index > -1);
        duplicatePropertyIndexes = duplicatePropertyIndexes.concat(properties.map(({ name, classId, propertyId }) => {
            const duplicates = properties.filter(x => x.name === name && x.classId === classId && x.propertyId === propertyId);
            if (duplicates.length > 1) {
                return properties.findIndex(x => x.name === name && x.classId === classId && x.propertyId === propertyId);
            }
            return -1;
        }).filter(index => index > -1));
        duplicatePropertyIndexes = [...new Set(duplicatePropertyIndexes)];
        let index = duplicatePropertyIndexes.shift();
        while (index > -1) {
            properties[index] = null;
            index = duplicatePropertyIndexes.shift();
        }
        properties = properties.filter(prop => prop);
        if (properties.some(({ propertyType }) => propertyType === null || propertyType === undefined || Reflection.isEmptyString(propertyType))) {
            throw new Error(`one or more property types could not be resolved.`);
        }
        properties.forEach(prop => {
            let { name, propertyType } = prop;
            propertyType = (new Type()).get({ name: propertyType });
            if (propertyType instanceof UnknownType) {
                throw new Error(`${name} property type could not be resolved.`);
            }
            prop.propertyType = propertyType.type;
        });
        const propertyTypeRegisterArray = properties.map(({ Class, name, propertyType, isGetter, isSetter }) => {
            return new PropertyTypeRegister(Class, name, propertyType, isGetter, isSetter);
        });
        super(propertyTypeRegisterArray, targetClass);
    }
}