import { ModelMeta } from "./meta";
import { ModelScope } from "./context";
import { ModelCreator } from "./types";
export declare class StoreModel<TModel> {
    readonly meta: ModelMeta<TModel>;
    private subscribers;
    private modelInitialized?;
    model: TModel;
    key?: any;
    context: ModelScope;
    init?: (props?: any) => Promise<void>;
    update?: (props?: any) => Promise<void>;
    constructor(meta: ModelMeta<TModel>, context: ModelScope, key?: any);
    emitModelChange(): void;
    getSubscribed(onModelChange: () => void): () => boolean;
}
declare class Store {
    private registry;
    private activatedCounter;
    activateModel<TModel>(TCreator: ModelCreator<TModel>, context: ModelScope, key?: any): StoreModel<TModel>;
    deactivateModel<TModel>(TCreator: ModelCreator<TModel>, key?: any): void;
    get<TModel>(TCreator: ModelCreator<TModel>, key?: any): StoreModel<TModel>;
}
declare const globalStore: Store;
export declare const store: <TModel>(TCreator: ModelCreator<TModel>) => TModel;
export default globalStore;
