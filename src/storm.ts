import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import globalStore, { storeSelector } from './store';
import { compareObjects } from './utils';
import { actionFilter as actionFilterFn, ActionFilterSelector, actionWrapper as actionWrapperFn, ActionWrapperSelector } from './decorators';
import { RemoveMethods, StormConnection } from './types';

const cloneDeep = require('lodash.clonedeep');


function createStoreModel<TModel>(TCreator: { new(): TModel; }, initialValue?: Partial<RemoveMethods<TModel>>, key?: any): StormConnection<TModel> {
  const model = activateStoreModel(TCreator, initialValue, key);

  type Selector<TSelect> = (state: TModel) => TSelect;

  function connectToStore(): TModel
  function connectToStore<TSelect>(selector: Selector<TSelect>): TSelect
  function connectToStore<TSelect>(selector?: Selector<TSelect>, key?: any): any {

    return useStoreModel(TCreator, selector, key)
  };

  // Tools

  function modelSelector<TSelect>(selector: (model: TModel) => TSelect): TSelect {
    return storeSelector(TCreator, selector);
  }

  function actionFilter(selector: ActionFilterSelector<TModel>) {
    return actionFilterFn(TCreator, selector);
  }

  function actionWrapper(preAction: ActionWrapperSelector<TModel>, postAction: ActionWrapperSelector<TModel>) {
    return actionWrapperFn(model, preAction, postAction);
  }
  
  return [
    connectToStore,
    {
      modelSelector,
      decorators: {
        actionFilter,
        actionWrapper
      }
    }
  ];
}

export const activateStoreModel = <TModel>(TCreator: { new(): TModel; }, initialValue?: Partial<RemoveMethods<TModel>>, key?: any): TModel => {
  const registryModel = globalStore.activateModel(TCreator, initialValue, key);
  return registryModel.model;
}

export const useStoreModel = <TModel, TSelect>(TCreator: { new(): TModel; }, selector?: (state: TModel) => TSelect, key?: any): TSelect => {

  const registryModel = globalStore.get(TCreator, key);
  const selectorSpecified = typeof selector === 'function';

  const getSnapshot = selectorSpecified
    ? () => cloneDeep(selector(registryModel.model)) as TSelect
    : () => cloneDeep(registryModel.model) as TSelect;

  
  return useSyncExternalStoreWithSelector<TModel, TSelect>(
    (onModelChange) => registryModel.getSubscribed(onModelChange),
    // @ts-ignore
    getSnapshot,
    null, // TODO: create implementation for next.js and etc.
    getSnapshot,
    compareObjects
  );
};

export default createStoreModel;