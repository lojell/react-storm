import React from "react";
import { StoreModel } from "./store";
export declare class ModelScope {
    readonly parent?: ModelScope | undefined;
    readonly model?: StoreModel<any> | undefined;
    childs: ModelScope[];
    constructor(parent?: ModelScope | undefined, model?: StoreModel<any> | undefined);
    push<TModel>(storeModel: StoreModel<TModel>): ModelScope;
    find<TModel>(TCreator: new (...args: any[]) => TModel): StoreModel<TModel> | null;
}
export declare const StormContext: React.Context<ModelScope>;
