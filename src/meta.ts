import { StoreModel } from "./store";

export class ModelMeta<TModel> {
  public id!: string;
  public name!: string;
  public dependencies!: any[];

  public fields: string[] = [];
  public actions: string[] = [];

  public model_ctor!: { new(...args: any[]): TModel };
  public proxy_ctor!: { new(store: StoreModel<TModel>, key?: any): TModel }

  public key(idx?: Number | string) {
    return idx != null ? `${this.id}_${idx}` : this.id;
  };
}