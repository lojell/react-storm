/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { FC, useContext, useMemo, useState, Fragment, useLayoutEffect, memo, useEffect } from "react";

import { ConnectedComponentProps, ModelCreator, StormConnection } from "./types";
import globalStore from "./store";
import { useModel_Internal } from "./storm";
import { StormContext } from "./context";
import { useLock } from "./utils";

export function connect<TModel>(TCreator: ModelCreator<TModel>, rootNode?: React.ComponentType<any>): StormConnection<TModel> {

  type Selector<TSelect> = (state: TModel) => TSelect;

  const RootNode = rootNode || Fragment

  function connectToStore(): TModel
  function connectToStore<TSelect extends Object>(selector: Selector<TSelect>): TSelect
  function connectToStore<TSelect extends Object>(selector?: Selector<TSelect>): any {
    const context = useContext(StormContext)
    const model = context.find(TCreator)

    if (!model)
      throw new Error(`Cannot find model: ${TCreator.name}`)

    return useModel_Internal(model, selector)
  };

  const Component: FC<ConnectedComponentProps> = ({ children, id, loading, ...props }) => {
    if (id !== undefined) {
      props.id = id
    }

    const oneTimeCall = useLock();
    const parentContext = useContext(StormContext)

    const activeModel = useMemo(() => {
      return globalStore.activateModel<TModel>(TCreator, parentContext, id)
    }, [id]);

    const [ready, setReady] = useState(!activeModel.init);
    const [error, setError] = useState<Error>();

    useLayoutEffect(() => {
      oneTimeCall(() => {
        if (activeModel.init) {
          activeModel
            .init(props)
            .catch((err) => setError(err))
            .finally(() => setReady(true))
        }
      })

      return () => {
        globalStore.deactivateModel<TModel>(TCreator, id);
      }
    }, [])

    useLayoutEffect(() => {
      if (activeModel.update) {
        activeModel.update(props);
      }
    }, [JSON.stringify(props)])

    if (!ready) {
      return loading ? <>{loading}</> : null
    }

    if (error) {
      throw error
    }

    return (
      <StormContext.Provider value={activeModel.context}>
        <RootNode>
          {children}
        </RootNode>
      </StormContext.Provider>
    )
  }

  class ComponentClass extends React.Component<ConnectedComponentProps, {}, any> {
    // constructor(props: ConnectedComponentProps) {
    //   super(props);
    // }

    render(): React.ReactNode {
      // @ts-ignore
      const key = this._reactInternals.key || this.props.id
      return <Component key={key} id={key} {...this.props} />
    }
  }

  return [Component, connectToStore];
}
