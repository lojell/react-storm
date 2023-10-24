import { ModelMeta } from "./meta";
import { StoreModel } from "./store";

export class Models {
  private static _modelsCache = new Map<any, ModelMeta<any>>();

  public static defineModel(target: any, dependencies: any[]) {
    const meta = Models.resolveMeta(target);
    meta.id = (Math.random() + 1).toString(36).substring(7);
    meta.name = target.name;
    meta.dependencies = dependencies;
    meta.model_ctor = target;
    meta.proxy_ctor = class {
      constructor(store: StoreModel<any>, key?: any) {
        const model = new meta.model_ctor(key);

        for (const propKey of Object.getOwnPropertyNames(Object.getPrototypeOf(model))) {
          if (propKey === 'constructor')
            continue;

          const originalMethod = model[propKey];

          if (meta.actions.includes(propKey)) {
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
          } else {

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

  public static getModelMetadata<TModel>(TCreator: { new(...args: any[]): TModel; }): ModelMeta<TModel> {
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
    // const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
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



