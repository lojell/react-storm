import { FC, PropsWithChildren } from "react";

export type NonMethodKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];
export type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>;

export type ConnectToStoreType<TModel> = (() => TModel) & (<TSelect>(selector: (state: TModel) => TSelect, id?: any) => TSelect) & (<TSelect>(selector: (state: TModel) => TSelect, id?: any) => any)

export type ConnectedComponentProps = { id?: string | number } & PropsWithChildren<unknown>

export type StormConnection<T> = [FC<ConnectedComponentProps>, ConnectToStoreType<T>]
