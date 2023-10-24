import { StoreModel } from "./store";
export declare class ModelMeta<TModel> {
    id: string;
    name: string;
    dependencies: any[];
    fields: string[];
    actions: string[];
    model_ctor: {
        new (...args: any[]): TModel;
    };
    proxy_ctor: {
        new (store: StoreModel<TModel>, key?: any): TModel;
    };
    key(idx?: Number | string): string;
}
