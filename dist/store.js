import { Models } from "./models";
import { promsify } from "./utils";
var StoreModel = /** @class */ (function () {
    function StoreModel(meta, context, key) {
        var _this = this;
        this.meta = meta;
        this.subscribers = new Set();
        this.key = key;
        this.model = new meta.proxy_ctor(this, key);
        this.context = context.push(this);
        this.init = this.model.init
            ? function (props) { return promsify(function () {
                if (!_this.modelInitialized) {
                    _this.modelInitialized = _this.model.init(props);
                    return _this.modelInitialized;
                }
                return null;
            }).finally(function () {
                _this.update = _this.model.update
                    ? function (newProps) { return promsify(function () { return _this.model.update(newProps); }); }
                    : undefined;
            }); }
            : undefined;
    }
    StoreModel.prototype.emitModelChange = function () {
        this.subscribers.forEach(function (onModelChange) { return onModelChange(); });
    };
    StoreModel.prototype.getSubscribed = function (onModelChange) {
        var _this = this;
        this.subscribers.add(onModelChange);
        return function () { return _this.subscribers.delete(onModelChange); };
    };
    return StoreModel;
}());
export { StoreModel };
var Store = /** @class */ (function () {
    function Store() {
        this.registry = new Map();
        this.activatedCounter = new Map();
    }
    Store.prototype.activateModel = function (TCreator, context, key) {
        var meta = Models.getMeta(TCreator);
        var modelKey = meta.key(key);
        this.activatedCounter.set(modelKey, (this.activatedCounter.get(modelKey) || 0) + 1);
        if (this.registry.has(modelKey)) {
            return this.registry.get(modelKey);
        }
        var storeModel = new StoreModel(meta, context, key);
        this.registry.set(meta.key(key), storeModel);
        console.log("Model activated: ".concat(storeModel.meta.name), storeModel);
        return storeModel;
    };
    Store.prototype.deactivateModel = function (TCreator, key) {
        var meta = Models.getMeta(TCreator);
        var modelKey = meta.key(key);
        var count = (this.activatedCounter.get(modelKey) || 0) - 1;
        this.activatedCounter.set(modelKey, count);
        if (count < 0) {
            throw new Error('Negative amount of activated Models, seems that activate Model called outside of connect method');
        }
        if (count === 0) {
            this.registry.delete(meta.key(key));
            console.log("Model deactivated: ".concat(meta.name), meta);
        }
    };
    Store.prototype.get = function (TCreator, key) {
        var meta = Models.getMeta(TCreator);
        var modelKey = meta.key(key);
        if (!this.registry.has(modelKey))
            throw new Error("Model ".concat(modelKey, " is not created"));
        return this.registry.get(modelKey);
    };
    return Store;
}());
var globalStore = new Store();
// @ts-ignore
window.globalStore = globalStore;
export var store = function (TCreator) {
    var depMeta = Models.getMeta(TCreator);
    var resolved = globalStore['registry'].get(depMeta.key());
    if (!resolved) {
        throw new Error("Dependency '".concat(depMeta.name, "' not found"));
    }
    return resolved.model;
};
export default globalStore;
//# sourceMappingURL=store.js.map