import React from "react";
var ModelScope = /** @class */ (function () {
    function ModelScope(parent, model) {
        this.parent = parent;
        this.model = model;
        this.childs = [];
        if (parent != null) {
            parent.childs.push(this);
        }
    }
    ModelScope.prototype.push = function (storeModel) {
        return new ModelScope(this, storeModel);
    };
    ModelScope.prototype.find = function (TCreator) {
        var _a, _b;
        if (!this.model && !this.parent)
            return null;
        else if (((_a = this.model) === null || _a === void 0 ? void 0 : _a.meta.model_ctor) === TCreator)
            return this.model;
        else
            return ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.find(TCreator)) || null;
    };
    return ModelScope;
}());
export { ModelScope };
var rootScope = new ModelScope();
export var StormContext = React.createContext(rootScope);
//# sourceMappingURL=context.js.map