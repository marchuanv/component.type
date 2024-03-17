import {
    PropertiesTypeRegister,
    PropertyTypeRegister,
    Reflection
} from 'component.property';
export class TypeRegisterEntry extends PropertiesTypeRegister {
    /**
     * @param { class } targetClass 
     * @param { Array<{ propertyName: String, propertyType: class }> } propertyTypes
    */
    constructor(targetClass, propertyTypes) {
        if (targetClass === null || targetClass === undefined || !Reflection.isClass(targetClass)) {
            throw new Error(`The targetClass argument is null, undefined or not a class.`);
        }
        if (propertyTypes === null || propertyTypes === undefined || !Array.isArray(propertyTypes)) {
            throw new Error(`The propertyTypes argument is null, undefined or not an array.`);
        }
        if (propertyTypes.find(({ propertyName, propertyType }) => 
            propertyName === null || propertyName === undefined ||
            Reflection.isEmptyString(propertyName) ||
            propertyType === null || propertyType === undefined ||
            !(Reflection.isClass(propertyType) || Reflection.isPrimitiveType(propertyType))
        )) {
            throw new Error(`The propertyName or propertyType in the propertyTypes argument is null or undefined.`);
        }
        const propertyTypeRegisterArray = Reflection.getClassMetadata(targetClass)
            .filter(({ isProperty, name }) => isProperty && propertyTypes.find(pt => pt.propertyName === name))
            .map(({ name, isGetter, isSetter }) => {
                const _propertyType = propertyTypes.find(x => x.propertyName === name);
                if (_propertyType) {
                    const { propertyName, propertyType } = _propertyType;
                    return new PropertyTypeRegister(targetClass, propertyName, propertyType, isGetter, isSetter)
                } else {
                    return null;
                }
            }).filter(x => x);
        super(propertyTypeRegisterArray, targetClass);
        const { associations } = super.get();
        if (associations === null || associations === undefined) {
            super.set(null, {});
        }
    }
}