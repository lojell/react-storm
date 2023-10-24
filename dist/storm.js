/* eslint-disable react-hooks/rules-of-hooks */
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import globalStore from './store';
import { compareObjects } from './utils';
var cloneDeep = require('lodash.clonedeep');
export var useModel_Internal = function (storeModel, selector, key) {
    var selectorSpecified = typeof selector === 'function';
    var getSnapshot = function () { return cloneDeep(storeModel.model); };
    var getSelected = function (model) { return selectorSpecified ? selector(model) : model; };
    return useSyncExternalStoreWithSelector(function (onModelChange) { return storeModel.getSubscribed(onModelChange); }, getSnapshot, null, // TODO: create implementation for next.js and etc.
    getSelected, compareObjects);
};
export var useModel = function (TCreator, selector, key) {
    var storeModel = globalStore.get(TCreator, key);
    return useModel_Internal(storeModel, selector, key);
};
//# sourceMappingURL=storm.js.map