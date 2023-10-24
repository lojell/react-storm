import { StoreModel } from './store';
export declare const useModel_Internal: <TModel, TSelect extends Object>(storeModel: StoreModel<TModel>, selector?: ((state: TModel) => TSelect) | undefined, key?: any) => TSelect;
export declare const useModel: <TModel, TSelect extends Object>(TCreator: new (...args: any[]) => TModel, selector?: ((state: TModel) => TSelect) | undefined, key?: any) => TSelect;
