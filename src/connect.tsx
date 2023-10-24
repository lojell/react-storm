/* eslint-disable react-hooks/rules-of-hooks */
import { FC, useContext, useEffect, useMemo } from "react";

import { ConnectedComponentProps, RemoveMethods, StormConnection } from "./types";
import globalStore from "./store";
import { useModel_Internal } from "./storm";
import { StormContext } from "./context";

export function connect<TModel>(TCreator: { new(...args: any[]): TModel; }, initialValue?: Partial<RemoveMethods<TModel>>): StormConnection<TModel> {

  type Selector<TSelect> = (state: TModel) => TSelect;

  function connectToStore(): TModel
  function connectToStore<TSelect extends Object>(selector: Selector<TSelect>): TSelect
  function connectToStore<TSelect extends Object>(selector?: Selector<TSelect>, key?: any): any {
    const context = useContext(StormContext)
    const model = context.find(TCreator)
    if (!model) throw new Error(`Cannot find model ${TCreator.name}`)
    return useModel_Internal(model, selector, model.key)
  };

  const Component: FC<ConnectedComponentProps> = ({ children, id }) => {
    const parentContext = useContext(StormContext)

    const model = useMemo(() => {
      return globalStore.activateModel<TModel>(TCreator, parentContext, id)
    }, [id, parentContext]);

    useEffect(() => {
      return () => {
        globalStore.deactivateModel<TModel>(TCreator, id);
      }
    }, [])

    return (
      <StormContext.Provider value={model.context}>
        {children}
      </StormContext.Provider>
    )
  }

  return [Component, connectToStore];
}
