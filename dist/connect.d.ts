import React from "react";
import { ModelCreator, StormConnection } from "./types";
export declare function connect<TModel>(TCreator: ModelCreator<TModel>, rootNode?: React.ComponentType<any>): StormConnection<TModel>;
