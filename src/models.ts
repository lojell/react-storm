import { ModelMeta } from "./meta";
import { StoreModel } from "./store";
import { ModelWithInit, ModelWithUpdate } from "./types";
import { shorid } from "./utils";

export class Models {
  private static _modelsCache = new Map<any, ModelMeta<any>>();

  public static defineModel(target: any, dependencies: any[]) {
    const meta = Models.resolveMeta(target);
    meta.id = shorid();
    meta.name = target.name;
    meta.dependencies = dependencies;
    meta.model_ctor = target;
    meta.proxy_ctor = class {
      constructor(store: StoreModel<any>, key?: any) {
        const model = new meta.model_ctor();

        for (const [propKey, propDesc] of Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(model)))) {
          if (propKey === 'constructor')
            continue;

          const originalMethod = model[propKey];

          if (meta.actions.includes(propKey)
            || (propDesc.value != null && (model as ModelWithInit).init === propDesc.value)
            || (propDesc.value != null && (model as ModelWithUpdate).update === propDesc.value)) {
            // TODO
            Object.assign(this, {
              [propKey]: (...args: IArguments[]) => {
                // @ts-ignore
                const result = originalMethod.apply(this, args);
                return Promise.resolve(result).then((val) => {
                  store.emitModelChange();
                  return val;
                });
              }
            })
          } else if (propDesc.get || propDesc.set) {
            Object.defineProperty(this, propKey, propDesc)
          } else {
            Object.assign(this, { [propKey]: (...args: IArguments[]) => originalMethod.apply(this, args) })
          }
        }

        Object.entries(model).forEach(([entry, value]) => {
          // @ts-ignore
          this[entry] = value
        })
      }
    }
  }

  public static defineField(target: any, propertyKey: string) {
    const meta = Models.resolveMeta(target.constructor);
    meta.fields.push(propertyKey)
  }

  public static defineAction(target: any, propertyKey: string) {
    const meta = Models.resolveMeta(target.constructor);
    meta.actions.push(propertyKey)
  }

  public static getMeta<TModel>(TCreator: { new(...args: any[]): TModel; }): ModelMeta<TModel> {
    const meta = Models._modelsCache.get(TCreator);
    if (!meta)
      throw new Error(`Model ${TCreator.name} is not React-Storm Model. Class should be decorated by @Model decorator`);

    return meta
  }

  private static resolveMeta(target: any) {
    let meta = Models._modelsCache.get(target);
    if (!meta) {
      meta = new ModelMeta()
      Models._modelsCache.set(target, meta);
    }
    return meta
  }
}

//
// Decorators
//
export function Model() {
  return function <T extends Object>(target: T) {
    Models.defineModel(target, [])
  };
}


export function Field() {
  return function (target: any, propertyKey: string) {
    Models.defineField(target, propertyKey)
  }
}


export function Action() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Models.defineAction(target, propertyKey)
  };
}

