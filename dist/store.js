import { Models } from "./models";
var StoreModel = /** @class */ (function () {
    function StoreModel(meta, context, key) {
        this.meta = meta;
        this.subscribers = new Set();
        this.key = key;
        this.model = new meta.proxy_ctor(this, key);
        this.context = context.push(this);
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
        var meta = Models.getModelMetadata(TCreator);
        var modelKey = meta.key(key);
        this.activatedCounter.set(modelKey, (this.activatedCounter.get(modelKey) || 0) + 1);
        if (this.registry.has(modelKey)) {
            return this.registry.get(modelKey);
        }
        var storeModel = new StoreModel(meta, context, key);
        this.registry.set(meta.key(key), storeModel);
        console.log('activateModel', storeModel);
        return storeModel;
    };
    Store.prototype.deactivateModel = function (TCreator, key) {
        var meta = Models.getModelMetadata(TCreator);
        var modelKey = meta.key(key);
        var count = (this.activatedCounter.get(modelKey) || 0) - 1;
        this.activatedCounter.set(modelKey, count);
        if (count < 0) {
            throw new Error('Negative amount of activated Models, seems that activate Model called outside of connect method');
        }
        if (count === 0) {
            this.registry.delete(meta.key(key));
            console.log('deactivateModel', meta);
        }
    };
    Store.prototype.get = function (TCreator, key) {
        var meta = Models.getModelMetadata(TCreator);
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
    var depMeta = Models.getModelMetadata(TCreator);
    var resolved = globalStore['registry'].get(depMeta.key());
    if (!resolved) {
        throw new Error("Dependency '".concat(depMeta.name, "' not found"));
    }
    return resolved.model;
};
export default globalStore;
//# sourceMappingURL=store.js.map