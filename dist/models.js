import { ModelMeta } from "./meta";
import { shorid } from "./utils";
var Models = /** @class */ (function () {
    function Models() {
    }
    Models.defineModel = function (target, dependencies) {
        var meta = Models.resolveMeta(target);
        meta.id = shorid();
        meta.name = target.name;
        meta.dependencies = dependencies;
        meta.model_ctor = target;
        meta.proxy_ctor = /** @class */ (function () {
            function class_1(store, key) {
                var _this = this;
                var model = new meta.model_ctor();
                var _loop_1 = function (propKey, propDesc) {
                    var _c, _d;
                    if (propKey === 'constructor')
                        return "continue";
                    var originalMethod = model[propKey];
                    if (meta.actions.includes(propKey)
                        || (propDesc.value != null && model.init === propDesc.value)
                        || (propDesc.value != null && model.update === propDesc.value)) {
                        // TODO
                        Object.assign(this_1, (_c = {},
                            _c[propKey] = function () {
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
                            _c));
                    }
                    else if (propDesc.get || propDesc.set) {
                        Object.defineProperty(this_1, propKey, propDesc);
                    }
                    else {
                        Object.assign(this_1, (_d = {}, _d[propKey] = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return originalMethod.apply(_this, args);
                        }, _d));
                    }
                };
                var this_1 = this;
                for (var _i = 0, _a = Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(model))); _i < _a.length; _i++) {
                    var _b = _a[_i], propKey = _b[0], propDesc = _b[1];
                    _loop_1(propKey, propDesc);
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
    Models.getMeta = function (TCreator) {
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