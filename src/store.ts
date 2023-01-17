import { proxyMethodCalls } from "./proxy";
import { RemoveMethods } from "./types";
import { activate } from "./utils";

class RegistryModel<T> {
  private subscribers: Set<() => void>;

  public model: T;

  constructor(model: T) {
    this.subscribers = new Set<() => void>();
    this.model = proxyMethodCalls(model, () => this.updateModel());
  }

  public updateModel() {
    this.subscribers.forEach(onModelChange => onModelChange());
  }

  public getSubscribed(onModelChange: () => void) {
    this.subscribers.add(onModelChange);
    return () => this.subscribers.delete(onModelChange);
  }
}

class Store {

  private registry = new Map<string, RegistryModel<any>>()

  public activateModel<TModel>(TCreator: { new(): TModel; }, initialValue?: Partial<RemoveMethods<TModel>>, key?: any): RegistryModel<TModel> {
    // @ts-ignore
    const modelKey = key ? `${TCreator.name}_${key}` : TCreator.name;

    if (this.registry.has(modelKey))
      throw new Error(`Model ${modelKey} is already activated`);

    const model = activate(TCreator);

    if (initialValue) {
      for (const key in initialValue) {
        if (Object.prototype.hasOwnProperty.call(model, key)) {
          // @ts-ignore
          model[key] = initialValue[key];
        }
      }
    }

    const registryModel = new RegistryModel(model)

    this.registry.set(modelKey, registryModel);

    return registryModel;
  }

  public get<TModel>(TCreator: { new(): TModel; }, key?: any): RegistryModel<TModel> {
    // @ts-ignore
    const modelKey = key ? `${TCreator.name}_${key}` : TCreator.name;

    if (!this.registry.has(modelKey))
      throw new Error(`Model ${modelKey} is not created`);

    return this.registry.get(modelKey) as RegistryModel<TModel>;
  }
}

const globalStore = new Store();

// @ts-ignore
window.globalStore = globalStore;

export function storeSelector<TModel, TSelect>(TCreator: { new(): TModel; }, selector: (model: TModel) => TSelect, key?: any): TSelect {
  const registryModel = globalStore.get(TCreator, key);
  return selector(registryModel.model);
}

export default globalStore;