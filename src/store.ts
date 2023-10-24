import { ModelMeta } from "./meta";
import { Models } from "./models";
import { ModelScope } from "./context";

export class StoreModel<TModel> {

  private subscribers: Set<() => void>;

  public model: TModel;
  public key?: any;

  public context: ModelScope;

  constructor(public readonly meta: ModelMeta<TModel>, context: ModelScope, key?: any) {
    this.subscribers = new Set<() => void>();
    this.key = key;
    this.model = new meta.proxy_ctor(this, key)
    this.context = context.push(this);
  }

  public emitModelChange() {
    this.subscribers.forEach(onModelChange => onModelChange());
  }

  public getSubscribed(onModelChange: () => void) {
    this.subscribers.add(onModelChange);
    return () => this.subscribers.delete(onModelChange);
  }
}

class Store {
  private registry = new Map<string, StoreModel<any>>()
  private activatedCounter = new Map<string, number>()

  public activateModel<TModel>(TCreator: { new(): TModel; }, context: ModelScope, key?: any): StoreModel<TModel> {
    const meta = Models.getModelMetadata(TCreator);
    const modelKey = meta.key(key)

    this.activatedCounter.set(modelKey, (this.activatedCounter.get(modelKey) || 0) + 1)

    if (this.registry.has(modelKey)) {
      return this.registry.get(modelKey) as StoreModel<TModel>
    }

    const storeModel = new StoreModel<TModel>(meta, context, key)

    this.registry.set(meta.key(key), storeModel);

    console.log('activateModel', storeModel)
    return storeModel;
  }

  public deactivateModel<TModel>(TCreator: { new(): TModel; }, key?: any) {
    const meta = Models.getModelMetadata(TCreator);
    const modelKey = meta.key(key);
    const count = (this.activatedCounter.get(modelKey) || 0) - 1
    this.activatedCounter.set(modelKey, count)

    if (count < 0) {
      throw new Error('Negative amount of activated Models, seems that activate Model called outside of connect method')
    }

    if (count === 0) {
      this.registry.delete(meta.key(key));
      console.log('deactivateModel', meta)
    }
  }

  public get<TModel>(TCreator: { new(): TModel; }, key?: any): StoreModel<TModel> {
    const meta = Models.getModelMetadata(TCreator);
    const modelKey = meta.key(key)

    if (!this.registry.has(modelKey))
      throw new Error(`Model ${modelKey} is not created`);

    return this.registry.get(modelKey) as StoreModel<TModel>;
  }
}

const globalStore = new Store();
// @ts-ignore
window.globalStore = globalStore;


export const store = <TModel>(TCreator: { new(): TModel; }): TModel => {
  const depMeta = Models.getModelMetadata(TCreator);
  const resolved = globalStore['registry'].get(depMeta.key());
  if (!resolved) {
    throw new Error(`Dependency '${depMeta.name}' not found`);
  }

  return resolved.model;
}

export default globalStore;