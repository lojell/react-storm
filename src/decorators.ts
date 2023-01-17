import { storeSelector } from "./store";

export type ActionFilterReturnType = boolean | Promise<boolean>
export type ActionFilterSelector<TModel> = (model: TModel) => ActionFilterReturnType
export type ActionWrapperSelector<TModel> = (model: TModel) => void


export function actionFilter<TModel>(TCreator: { new(): TModel; }, selector: ActionFilterSelector<TModel>): () => any {
  return function () {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {

        const selectorEntry = storeSelector(TCreator, selector);
        const isAllowed = await selectorEntry

        if (isAllowed) {
          return await originalMethod.apply(this, args);
        }
      }

      return descriptor;
    };
  }
}


export function actionWrapper<TModel>(model: TModel, preAction: ActionWrapperSelector<TModel>, postAction: ActionWrapperSelector<TModel>): () => any {
  return function () {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {

        preAction(model)

        let result = null;
        try {
          result = await originalMethod.apply(this, args);
        } finally {
          postAction(model);
        }

        return result;
      }

      return descriptor;
    };
  }
}
