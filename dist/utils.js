function decycle(obj, stack) {
    if (stack === void 0) { stack = []; }
    if (!obj || typeof obj !== 'object')
        return obj;
    if (stack.includes(obj))
        return null;
    var s = stack.concat([obj]);
    return Array.isArray(obj)
        ? obj.map(function (x) { return decycle(x, s); })
        : Object.fromEntries(Object.entries(obj)
            .map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, decycle(v, s)];
        }));
}
export function compareObjects(a, b) {
    // TODO: very rough, needs to be rewritten in a better way
    // return JSON.stringify(a) === JSON.stringify(b)
    return JSON.stringify(decycle(a)) === JSON.stringify(decycle(b));
}
//# sourceMappingURL=utils.js.map