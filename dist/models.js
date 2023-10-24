import { ModelMeta } from "./meta";
var Models = /** @class */ (function () {
    function Models() {
    }
    Models.defineModel = function (target, dependencies) {
        var meta = Models.resolveMeta(target);
        meta.id = (Math.random() + 1).toString(36).substring(7);
        meta.name = target.name;
        meta.dependencies = dependencies;
        meta.model_ctor = target;
        meta.proxy_ctor = /** @class */ (function () {
            function class_1(store, key) {
                var _this = this;
                var model = new meta.model_ctor(key);
                var _loop_1 = function (propKey) {
                    var _b;
                    if (propKey === 'constructor')
                        return "continue";
                    var originalMethod = model[propKey];
                    if (meta.actions.includes(propKey)) {
                        // TODO
                        Object.assign(this_1, (_b = {},
                            _b[propKey] = function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                // @ts-ignore
                                var result = originalMethod.apply(_this, args);
                                return Promise.resolve(result).then(function (val) {
                                    store.emitModelChange();
                                    return val;
                                });
                            },
                            _b));
                    }
                    else {
                    }
                };
                var this_1 = this;
                for (var _i = 0, _a = Object.getOwnPropertyNames(Object.getPrototypeOf(model)); _i < _a.length; _i++) {
                    var propKey = _a[_i];
                    _loop_1(propKey);
                }
                Object.entries(model).forEach(function (_a) {
                    var entry = _a[0], value = _a[1];
                    // @ts-ignore
                    _this[entry] = value;
                });
            }
            return class_1;
        }());
    };
    Models.defineField = function (target, propertyKey) {
        var meta = Models.resolveMeta(target.constructor);
        meta.fields.push(propertyKey);
    };
    Models.defineAction = function (target, propertyKey) {
        var meta = Models.resolveMeta(target.constructor);
        meta.actions.push(propertyKey);
    };
    Models.getModelMetadata = function (TCreator) {
        var meta = Models._modelsCache.get(TCreator);
        if (!meta)
            throw new Error("Model ".concat(TCreator.name, " is not React-Storm Model. Class should be decorated by @Model decorator"));
        return meta;
    };
    Models.resolveMeta = function (target) {
        var meta = Models._modelsCache.get(target);
        if (!meta) {
            meta = new ModelMeta();
            Models._modelsCache.set(target, meta);
        }
        return meta;
    };
    Models._modelsCache = new Map();
    return Models;
}());
export { Models };
//
// Decorators
//
export function Model() {
    return function (target) {
        // const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
        Models.defineModel(target, []);
    };
}
export function Field() {
    return function (target, propertyKey) {
        Models.defineField(target, propertyKey);
    };
}
export function Action() {
    return function (target, propertyKey, descriptor) {
        Models.defineAction(target, propertyKey);
    };
}
//# sourceMappingURL=models.js.map