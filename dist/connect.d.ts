import { RemoveMethods, StormConnection } from "./types";
export declare function connect<TModel>(TCreator: {
    new (...args: any[]): TModel;
}, initialValue?: Partial<RemoveMethods<TModel>>): StormConnection<TModel>;
