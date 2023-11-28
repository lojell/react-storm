import { StoreModel } from "./store";
import { ModelCreator } from "./types";
export declare class ModelMeta<TModel> {
    id: string;
    name: string;
    dependencies: any[];
    fields: string[];
    actions: string[];
    model_ctor: ModelCreator<TModel>;
    proxy_ctor: {
        new (store: StoreModel<TModel>, key?: any, props?: any): TModel;
    };
    key(idx?: Number | string): string;
}
