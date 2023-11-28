import React, { FC, PropsWithChildren, ReactNode } from "react";

export type NonMethodKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];
export type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>;

export type ConnectToStoreType<TModel> = (() => TModel) & (<TSelect>(selector: (state: TModel) => TSelect, id?: any) => TSelect) & (<TSelect>(selector: (state: TModel) => TSelect, id?: any) => any)

export type ConnectedComponentProps = {
  id?: string | number | null | undefined,
  loading?: ReactNode,
  [prop: string]: any;
}

// export type StormConnection<T> = [FC<PropsWithChildren<ConnectedComponentProps>>, ConnectToStoreType<T>]
export type StormConnection<T> = [React.ComponentType<ConnectedComponentProps>, ConnectToStoreType<T>]

export type ModelCreator<TModel> ={ new(...args: any[]): TModel; };

export type ModelWithInit = {
  init: (props?: any) => void | Promise<void>
} 

export type ModelWithUpdate = {
  update: (props?: any) => void | Promise<void>
} 
