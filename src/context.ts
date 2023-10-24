import React from "react";
import { StoreModel } from "./store";

export class ModelScope {
  public childs: ModelScope[] = []

  constructor(public readonly parent?: ModelScope, public readonly model?: StoreModel<any>) {
    if (parent != null) {
      parent.childs.push(this);
    }
  }

  public push<TModel>(storeModel: StoreModel<TModel>) {
    return new ModelScope(this, storeModel)
  }

  public find<TModel>(TCreator: new (...args: any[]) => TModel): StoreModel<TModel> | null {
    if (!this.model && !this.parent)
      return null
    else if (this.model?.meta.model_ctor === TCreator)
      return this.model
    else
      return this.parent?.find(TCreator) || null
  }
}

const rootScope = new ModelScope();

export const StormContext = React.createContext(rootScope)
