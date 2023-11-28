/* eslint-disable react-hooks/rules-of-hooks */
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import globalStore from './store';
import { compareObjects } from './utils';
var cloneDeep = require('lodash.clonedeep');
export var useModel_Internal = function (storeModel, selector) {
    var selectorSpecified = typeof selector === 'function';
    var getSnapshot = function () { return [storeModel.model]; }; // TODO: emulating new ref
    var getSelected = function (_a) {
        var model = _a[0];
        return cloneDeep(selectorSpecified ? selector(model) : model);
    };
    return useSyncExternalStoreWithSelector(function (onModelChange) { return storeModel.getSubscribed(onModelChange); }, 
    // @ts-ignore
    getSnapshot, null, // TODO: create implementation for next.js and etc.
    getSelected, compareObjects);
};
export var useModel = function (TCreator, selector) {
    var storeModel = globalStore.get(TCreator);
    return useModel_Internal(storeModel, selector);
};
//# sourceMappingURL=storm.js.map