import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import { proxyMethodCalls } from './proxy';
import { activate } from './utils';

const registry = {};

function createModel<TModel>(TCreator: { new(): TModel; }) {
  // @ts-ignores
  let model = (registry[TCreator.name] = registry[TCreator.name] || activate(TCreator));
  const modelChangeSubscribers = new Set();

  const updateModel = () => {
    // @ts-ignore
    modelChangeSubscribers.forEach(onModelChange => onModelChange());
  }

  const getSubscribed = (onModelChange: () => void) => {
    modelChangeSubscribers.add(onModelChange);
    return () => modelChangeSubscribers.delete(onModelChange);
  }

  model = proxyMethodCalls(model, () => updateModel());

  const compareFn = (a: Partial<TModel>, b: Partial<TModel>) => {
    // TODO: very rough, needs to be rewritten in a better way
    return JSON.stringify(a) === JSON.stringify(b)
  }

  type Selector<TSelect> = (state: TModel) => TSelect;

  function connectToStore(): TModel;
  function connectToStore<TSelect>(selector: Selector<TSelect>): TSelect
  function connectToStore<TSelect>(selector?: Selector<TSelect>): any {

    const selectorSpecified = typeof selector === 'function';
    const getSnapshot = selectorSpecified
      ? () => ({ ...selector(model) })
      : () => ({ ...model });

    const selectorCallback = selectorSpecified
      ? selector
      : () => model;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSyncExternalStoreWithSelector<TModel, TSelect>(
      getSubscribed,
      getSnapshot,
      null, // TODO: create implementation for next.js and etc.
      selectorCallback,
      compareFn
    );
  }

  return connectToStore;
}

export default createModel;