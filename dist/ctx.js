"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    constructor() {
        this.dataLoaders = new Map();
        this.isDebug = false;
    }
    getDataLoader(id, cstr) {
        if (!this.dataLoaders.has(id)) {
            this.dataLoaders.set(id, cstr());
        }
        return this.dataLoaders.get(id);
    }
}
exports.Context = Context;
