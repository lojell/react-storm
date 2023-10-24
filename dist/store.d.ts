import { ModelMeta } from "./meta";
import { ModelScope } from "./context";
export declare class StoreModel<TModel> {
    readonly meta: ModelMeta<TModel>;
    private subscribers;
    model: TModel;
    key?: any;
    context: ModelScope;
    constructor(meta: ModelMeta<TModel>, context: ModelScope, key?: any);
    emitModelChange(): void;
    getSubscribed(onModelChange: () => void): () => boolean;
}
declare class Store {
    private registry;
    private activatedCounter;
    activateModel<TModel>(TCreator: {
        new (): TModel;
    }, context: ModelScope, key?: any): StoreModel<TModel>;
    deactivateModel<TModel>(TCreator: {
        new (): TModel;
    }, key?: any): void;
    get<TModel>(TCreator: {
        new (): TModel;
    }, key?: any): StoreModel<TModel>;
}
declare const globalStore: Store;
export declare const store: <TModel>(TCreator: new () => TModel) => TModel;
export default globalStore;
