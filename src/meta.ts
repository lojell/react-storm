import { StoreModel } from "./store";
import { ModelCreator } from "./types";

export class ModelMeta<TModel> {
  public id!: string;
  public name!: string;
  public dependencies!: any[];

  public fields: string[] = [];
  public actions: string[] = [];

  public model_ctor!: ModelCreator<TModel>;
  public proxy_ctor!: { new(store: StoreModel<TModel>, key?: any, props?: any): TModel }

  public key(idx?: Number | string) {
    return idx != null ? `${this.id}_${idx}` : this.id;
  };
}