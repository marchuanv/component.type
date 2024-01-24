import {
    ClassIntegrity,
    MemberParameter,
    MethodMember,
    PropertyMember,
    TypeDefinition
} from '../registry.mjs';
const privateBag = new WeakMap();
export class ClassInterface extends ClassIntegrity {
    /**
     * @param { Object } classInterfaceConfig
     * @param  { class } targetClass
    */
    constructor(classInterfaceConfig, targetClass) {
        if (privateBag.has(classInterfaceConfig)) {
            const { ctor } = privateBag.get(classInterfaceConfig);
            super(ctor);
            privateBag.set(this, classInterfaceConfig);
            return;
        }
        const { dependencies } = classInterfaceConfig;
        const classExtDep = dependencies.find(dep => dep.isExtend);
        if (classExtDep) {
            const { config } = TypeDefinition.find(classExtDep);
            if (!privateBag.has(config)) {
                const { type } = TypeDefinition.find({ Id: config.Id });
                new ClassInterface(config, type);
            }
            for (const method of config.methods) {
                if (!classInterfaceConfig.methods.find(x => x.name === method.name)) {
                    classInterfaceConfig.methods.push(method);
                }
            }
            for (const property of config.properties) {
                if (!classInterfaceConfig.properties.find(x => x.name === property.name)) {
                    classInterfaceConfig.properties.push(property);
                }
            }
            for (const ctorParam of config.ctor.parameters) {
                if (!classInterfaceConfig.ctor.parameters.find(x => x.name === ctorParam.name)) {
                    classInterfaceConfig.ctor.parameters.push(ctorParam);
                }
            }
        }
        for (const memberDep of dependencies.filter(dep => !dep.isExtend)) {
            const { config } = TypeDefinition.find(memberDep);
            if (!privateBag.has(config)) {
                const { type } = TypeDefinition.find(config);
                new ClassInterface(config, type);
            }
        }
        const ctorMemberParameters = [];
        for (const param of classInterfaceConfig.ctor.parameters) {
            const convertToArray = param.convertToArray;
            const { Id, typeName } = param.typeDefinition;
            if (TypeDefinition.find({ Id })) {
                const field = {};
                field[param.name] = null;
                const memberParameter = new MemberParameter(field, Id, convertToArray);
                ctorMemberParameters.push(memberParameter);
            } else {
                throw new Error(`unable to resolve type ref id: ${Id}, typeName: ${typeName}`);
            }
        }
        const ctorTypeDefinition = TypeDefinition.find({ Id: classInterfaceConfig.Id });
        const ctor = new MethodMember(classInterfaceConfig.ctor.name, false, true, ctorMemberParameters, ctorTypeDefinition);
        const methods = [];
        const { Id, className, scriptFilePath } = classInterfaceConfig;
        for (const method of classInterfaceConfig.methods) {
            const { isStatic, typeDefinition, convertToArray } = method;
            const { Id, typeName } = typeDefinition;
            const typeDef = TypeDefinition.find({ Id });
            if (typeDef) {
                let returnType = typeDef;
                const methodParameters = [];
                for (const param of method.parameters) {
                    const { Id } = param.typeDefinition;
                    const convertToArray = param.convertToArray;
                    if (TypeDefinition.find({ Id })) {
                        const field = {};
                        field[param.name] = null;
                        const memberParameter = new MemberParameter(field, Id, convertToArray);
                        methodParameters.push(memberParameter);
                    } else {
                        throw new Error(`unable to resolve type ref id: ${$refId}`);
                    }
                }
                methods.push(new MethodMember(method.name, isStatic, false, methodParameters, returnType));
            } else {
                throw new Error(`unable to resolve type ref id: ${Id}, typeName: ${typeName}`);
            }
        }
        const properties = [];
        for (const property of classInterfaceConfig.properties) {
            const { isStatic, isGetter, isSetter, typeDefinition, convertToArray } = property;
            const { Id, typeName } = typeDefinition;
            const typeDef = TypeDefinition.find({ Id });
            if (typeDef) {
                let returnType = typeDef;
                const propertyParameters = [];
                for (const param of property.parameters) {
                    const { Id } = param.typeDefinition;
                    const convertToArray = param.convertToArray;
                    if (TypeDefinition.find({ Id })) {
                        const field = {};
                        field[param.name] = null;
                        const memberParameter = new MemberParameter(field, Id, convertToArray);
                        propertyParameters.push(memberParameter);
                    } else {
                        throw new Error(`unable to resolve type ref id: ${$refId}`);
                    }
                }
                properties.push(new PropertyMember(property.name, isStatic, isGetter, isSetter, propertyParameters, returnType));
            } else {
                throw new Error(`unable to resolve type ref id: ${Id}, typeName: ${typeName}`);
            }
        }
        privateBag.set(classInterfaceConfig, {
            Id,
            name: className,
            scriptFilePath,
            ctor,
            methods,
            properties,
            schema: null
        });
        super(ctor);
        privateBag.set(this, classInterfaceConfig);
    }
    /**
     * @returns { String }
    */
    get Id() {
        const classInterfaceConfig = privateBag.get(this);
        const { Id } = privateBag.get(classInterfaceConfig);
        return Id;
    }
    /**
     * @param { String } paramName
     * @returns { String }
    */
    get dependencies() {
        const classInterfaceConfig = privateBag.get(this);
        const { dependencies } = classInterfaceConfig;
        return dependencies;
    }
    /**
     * @returns { String }
    */
    get name() {
        const targetClass = privateBag.get(this);
        const { name } = privateBag.get(targetClass);
        return name;
    }
    /**
    * @returns { String }
    */
    get filePath() {
        const targetClass = privateBag.get(this);
        const { filePath } = privateBag.get(targetClass);
        return filePath;
    }
    /**
     * @returns { Array<MethodMember> }
    */
    get methods() {
        const targetClass = privateBag.get(this);
        const { methods } = privateBag.get(targetClass);
        return methods;
    }
    /**
     * @returns { MethodMember }
    */
    get ctor() {
        const targetClass = privateBag.get(this);
        const { ctor } = privateBag.get(targetClass);
        return ctor;
    }
    /**
     * @returns { Array<PropertyMember> }
    */
    get properties() {
        const targetClass = privateBag.get(this);
        const { properties } = privateBag.get(targetClass);
        return properties;
    }
}