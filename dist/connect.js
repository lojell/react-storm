var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useContext, useMemo, useState, Fragment, useLayoutEffect } from "react";
import globalStore from "./store";
import { useModel_Internal } from "./storm";
import { StormContext } from "./context";
import { useLock } from "./utils";
export function connect(TCreator, rootNode) {
    var RootNode = rootNode || Fragment;
    function connectToStore(selector) {
        var context = useContext(StormContext);
        var model = context.find(TCreator);
        if (!model)
            throw new Error("Cannot find model: ".concat(TCreator.name));
        return useModel_Internal(model, selector);
    }
    ;
    var Component = function (_a) {
        var children = _a.children, id = _a.id, loading = _a.loading, props = __rest(_a, ["children", "id", "loading"]);
        if (id !== undefined) {
            props.id = id;
        }
        var oneTimeCall = useLock();
        var parentContext = useContext(StormContext);
        var activeModel = useMemo(function () {
            return globalStore.activateModel(TCreator, parentContext, id);
        }, [id]);
        var _b = useState(!activeModel.init), ready = _b[0], setReady = _b[1];
        var _c = useState(), error = _c[0], setError = _c[1];
        useLayoutEffect(function () {
            oneTimeCall(function () {
                if (activeModel.init) {
                    activeModel
                        .init(props)
                        .catch(function (err) { return setError(err); })
                        .finally(function () { return setReady(true); });
                }
            });
            return function () {
                globalStore.deactivateModel(TCreator, id);
            };
        }, []);
        useLayoutEffect(function () {
            if (activeModel.update) {
                activeModel.update(props);
            }
        }, [JSON.stringify(props)]);
        if (!ready) {
            return loading ? _jsx(_Fragment, { children: loading }) : null;
        }
        if (error) {
            throw error;
        }
        return (_jsx(StormContext.Provider, __assign({ value: activeModel.context }, { children: _jsx(RootNode, { children: children }) })));
    };
    var ComponentClass = /** @class */ (function (_super) {
        __extends(ComponentClass, _super);
        function ComponentClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // constructor(props: ConnectedComponentProps) {
        //   super(props);
        // }
        ComponentClass.prototype.render = function () {
            // @ts-ignore
            var key = this._reactInternals.key || this.props.id;
            return _jsx(Component, __assign({ id: key }, this.props), key);
        };
        return ComponentClass;
    }(React.Component));
    return [Component, connectToStore];
}
//# sourceMappingURL=connect.js.map