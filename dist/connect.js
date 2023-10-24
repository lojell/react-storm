var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useMemo } from "react";
import globalStore from "./store";
import { useModel_Internal } from "./storm";
import { StormContext } from "./context";
export function connect(TCreator, initialValue) {
    function connectToStore(selector, key) {
        var context = useContext(StormContext);
        var model = context.find(TCreator);
        if (!model)
            throw new Error("Cannot find model ".concat(TCreator.name));
        return useModel_Internal(model, selector, model.key);
    }
    ;
    var Component = function (_a) {
        var children = _a.children, id = _a.id;
        var parentContext = useContext(StormContext);
        var model = useMemo(function () {
            return globalStore.activateModel(TCreator, parentContext, id);
        }, [id, parentContext]);
        useEffect(function () {
            return function () {
                globalStore.deactivateModel(TCreator, id);
            };
        }, []);
        return (_jsx(StormContext.Provider, __assign({ value: model.context }, { children: children })));
    };
    return [Component, connectToStore];
}
//# sourceMappingURL=connect.js.map