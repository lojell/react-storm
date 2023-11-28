import { StoreModel } from './store';
import { ModelCreator } from './types';
export declare const useModel_Internal: <TModel, TSelect extends Object>(storeModel: StoreModel<TModel>, selector?: ((state: TModel) => TSelect) | undefined) => TSelect;
export declare const useModel: <TModel, TSelect extends Object>(TCreator: ModelCreator<TModel>, selector?: ((state: TModel) => TSelect) | undefined) => TSelect;
