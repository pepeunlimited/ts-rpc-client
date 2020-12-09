"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnknownError = exports.isTwirpError = exports.Rpc = exports.Context = void 0;
const http_1 = __importDefault(require("http"));
class Context {
    constructor() {
        this.dataLoaders = new Map();
        this.isDebug = false;
    }
    getDataLoader(id, cstr) {
        if (this.isDebug) {
            console.log("DataLoaders-id: " + id);
            console.log("DataLoaders: " + this.dataLoaders);
        }
        if (!this.dataLoaders.has(id)) {
            this.dataLoaders.set(id, cstr());
        }
        return this.dataLoaders.get(id);
    }
}
exports.Context = Context;
class Rpc {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    request(ctx, service, method, data) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            const path = "/twirp/" + service + "/" + method;
            let headers = {};
            headers = {
                'Content-Type': 'application/protobuf',
                'Content-Length': Buffer.byteLength(data),
            };
            if (ctx.isDebug) {
                console.log(" ---- Begin ---- ");
                console.log("SERVICE: " + service);
                console.log("METHOD: " + method);
                console.log("PATH: " + path);
                console.log("HEADERS:");
                console.log(headers);
                //console.log("CTX:");
                //console.log(ctx);
                console.log(" ---- End ---- ");
            }
            const config = {
                hostname: this.host,
                port: this.port,
                path: path,
                method: 'POST',
                headers: headers,
            };
            const req = http_1.default
                .request(config, res => {
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => {
                    const data = Buffer.concat(chunks);
                    if (res.statusCode != 200) {
                        reject(onError(data));
                    }
                    else {
                        resolve(data);
                    }
                });
                res.on('error', err => {
                    reject(onUnknownError(err, null));
                });
            })
                .on('error', err => {
                reject(onUnknownError(err, null));
            });
            req.end(data);
        });
    }
}
exports.Rpc = Rpc;
function onError(data) {
    try {
        const json = JSON.parse(data.toString());
        const error = new Error();
        error.isTwirpError = true;
        if (json.meta != null) {
            error.argument = json.meta['argument'];
        }
        error.msg = json.msg;
        error.code = json.code;
        return error;
    }
    catch (error) {
        return onUnknownError(error, data.toString());
    }
}
function onUnknownError(error, data) {
    error.isUnknownError = true;
    if (data == null) {
        error.msg = error.message;
    }
    else {
        error.msg = data;
    }
    return error;
}
exports.isTwirpError = (err) => {
    return !!(err instanceof Error && err.isTwirpError);
};
exports.isUnknownError = (err) => {
    return !!(err instanceof Error && err.isUnknownError);
};
