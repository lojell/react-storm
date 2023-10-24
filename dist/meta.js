var ModelMeta = /** @class */ (function () {
    function ModelMeta() {
        this.fields = [];
        this.actions = [];
    }
    ModelMeta.prototype.key = function (idx) {
        return idx != null ? "".concat(this.id, "_").concat(idx) : this.id;
    };
    ;
    return ModelMeta;
}());
export { ModelMeta };
//# sourceMappingURL=meta.js.map