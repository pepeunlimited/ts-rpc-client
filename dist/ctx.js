"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    constructor() {
        /**
         * REMEMBER:
         *
         * If function returns an Error instance for an individual value,
         * that Error will be CACHED to avoid frequently loading the same Error
         *
         * Avoid Error not be CACHED using dataLoaders.clear()
         */
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
