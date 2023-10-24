/* eslint-disable react-hooks/rules-of-hooks */
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import globalStore, { StoreModel } from './store';
import { compareObjects } from './utils';

const cloneDeep = require('lodash.clonedeep');

export const useModel_Internal = <TModel, TSelect extends Object>(storeModel: StoreModel<TModel>, selector?: (state: TModel) => TSelect, key?: any): TSelect => {
  const selectorSpecified = typeof selector === 'function';

  const getSnapshot = () => cloneDeep(storeModel.model) as TModel
  const getSelected = (model: any) => selectorSpecified ? selector(model) : model

  return useSyncExternalStoreWithSelector<TModel, TSelect>(
    (onModelChange) => storeModel.getSubscribed(onModelChange),
    getSnapshot,
    null, // TODO: create implementation for next.js and etc.
    getSelected,
    compareObjects
  );
};

export const useModel = <TModel, TSelect extends Object>(TCreator: { new(...args: any[]): TModel; }, selector?: (state: TModel) => TSelect, key?: any): TSelect => {
  const storeModel = globalStore.get(TCreator, key);
  return useModel_Internal(storeModel, selector, key);
};