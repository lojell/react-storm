import { ModelMeta } from "./meta";
import { Models } from "./models";
import { ModelScope } from "./context";
import { ModelCreator, ModelWithInit, ModelWithUpdate } from "./types";
import { promsify } from "./utils";

export class StoreModel<TModel> {
  private subscribers: Set<() => void>;
  private modelInitialized?: void | Promise<void>;

  public model: TModel;
  public key?: any;
  public context: ModelScope;
  public init?: (props?: any) => Promise<void>;
  public update?: (props?: any) => Promise<void>;

  constructor(public readonly meta: ModelMeta<TModel>, context: ModelScope, key?: any) {
    this.subscribers = new Set<() => void>();
    this.key = key;
    this.model = new meta.proxy_ctor(this, key)
    this.context = context.push(this);

    this.init = (this.model as ModelWithInit).init
      ? (props: any) => promsify(() => {
        if (!this.modelInitialized) {
          this.modelInitialized = (this.model as ModelWithInit).init(props)
          return this.modelInitialized
        }

        return null;
      }).finally(() => {
        this.update = (this.model as ModelWithUpdate).update
          ? (newProps: any) => promsify(() => (this.model as ModelWithUpdate).update(newProps))
          : undefined;
      })
      : undefined;
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

  public activateModel<TModel>(TCreator: ModelCreator<TModel>, context: ModelScope, key?: any): StoreModel<TModel> {
    const meta = Models.getMeta(TCreator);
    const modelKey = meta.key(key)

    this.activatedCounter.set(modelKey, (this.activatedCounter.get(modelKey) || 0) + 1)

    if (this.registry.has(modelKey)) {
      return this.registry.get(modelKey) as StoreModel<TModel>
    }

    const storeModel = new StoreModel<TModel>(meta, context, key)

    this.registry.set(meta.key(key), storeModel);

    console.log(`Model activated: ${storeModel.meta.name}`, storeModel)

    return storeModel;
  }

  public deactivateModel<TModel>(TCreator: ModelCreator<TModel>, key?: any) {
    const meta = Models.getMeta(TCreator);
    const modelKey = meta.key(key);
    const count = (this.activatedCounter.get(modelKey) || 0) - 1
    this.activatedCounter.set(modelKey, count)

    if (count < 0) {
      throw new Error('Negative amount of activated Models, seems that activate Model called outside of connect method')
    }

    if (count === 0) {
      this.registry.delete(meta.key(key));

      console.log(`Model deactivated: ${meta.name}`, meta)
    }
  }

  public get<TModel>(TCreator: ModelCreator<TModel>, key?: any): StoreModel<TModel> {
    const meta = Models.getMeta(TCreator);
    const modelKey = meta.key(key)

    if (!this.registry.has(modelKey))
      throw new Error(`Model ${modelKey} is not created`);

    return this.registry.get(modelKey) as StoreModel<TModel>;
  }
}

const globalStore = new Store();
// @ts-ignore
window.globalStore = globalStore;


export const store = <TModel>(TCreator: ModelCreator<TModel>): TModel => {
  const depMeta = Models.getMeta(TCreator);
  const resolved = globalStore['registry'].get(depMeta.key());
  if (!resolved) {
    throw new Error(`Dependency '${depMeta.name}' not found`);
  }

  return resolved.model;
}

export default globalStore;