import { ActionFilterSelector, ActionWrapperSelector } from './decorators';

export type ConnectToStoreType<TModel> = (() => TModel) & (<TSelect>(selector: (state: TModel) => TSelect, id?: any) => TSelect) & (<TSelect>(selector: (state: TModel) => TSelect, id?: any) => any)
export type ModelDecorators<TModel> = {
  actionFilter: (selector: ActionFilterSelector<TModel>) => any,
  actionWrapper: (preAction: ActionWrapperSelector<TModel>, postAction: ActionWrapperSelector<TModel>) => any
}
export type ModelTools<TModel> = {
  modelSelector: <TSelect>(selector: (model: TModel) => TSelect) => TSelect;
  decorators: ModelDecorators<TModel>
}

export type NonMethodKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];
export type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>;

export type StormConnection<T> = [ConnectToStoreType<T>, ModelTools<T>]