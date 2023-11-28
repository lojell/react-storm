/* eslint-disable react-hooks/rules-of-hooks */
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import globalStore, { StoreModel } from './store';
import { compareObjects } from './utils';
import { ModelCreator } from './types';

const cloneDeep = require('lodash.clonedeep');

export const useModel_Internal = <TModel, TSelect extends Object>(storeModel: StoreModel<TModel>, selector?: (state: TModel) => TSelect): TSelect => {
  const selectorSpecified = typeof selector === 'function';

  const getSnapshot = () => [storeModel.model]; // TODO: emulating new ref
  const getSelected = ([model]: any) => {
    return cloneDeep(selectorSpecified ? selector(model) : model)
  }

  return useSyncExternalStoreWithSelector<TModel, TSelect>(
    (onModelChange) => storeModel.getSubscribed(onModelChange),
    // @ts-ignore
    getSnapshot,
    null, // TODO: create implementation for next.js and etc.
    getSelected,
    compareObjects
  );
};

export const useModel = <TModel, TSelect extends Object>(TCreator: ModelCreator<TModel>, selector?: (state: TModel) => TSelect): TSelect => {
  const storeModel = globalStore.get(TCreator);
  return useModel_Internal(storeModel, selector);
};