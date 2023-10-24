import { ModelMeta } from "./meta";
export declare class Models {
    private static _modelsCache;
    static defineModel(target: any, dependencies: any[]): void;
    static defineField(target: any, propertyKey: string): void;
    static defineAction(target: any, propertyKey: string): void;
    static getModelMetadata<TModel>(TCreator: {
        new (...args: any[]): TModel;
    }): ModelMeta<TModel>;
    private static resolveMeta;
}
export declare function Model(): <T extends Object>(target: T) => void;
export declare function Field(): (target: any, propertyKey: string) => void;
export declare function Action(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
