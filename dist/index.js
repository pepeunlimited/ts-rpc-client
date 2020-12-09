"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnknownError = exports.isTwirpError = exports.Rpc = exports.Context = void 0;
const axios_1 = __importDefault(require("axios"));
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
class Rpc {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    request(ctx, service, method, data) {
        const chunks = [];
        const path = "/twirp/" + service + "/" + method;
        let headers = {};
        headers = {
            'Accept': 'application/protobuf',
            'Content-Type': 'application/protobuf',
            'Content-Length': Buffer.byteLength(data),
        };
        const config = {
            baseURL: 'http://' + this.host + ':' + this.port,
            method: 'POST',
            url: path,
            responseType: 'arraybuffer',
            headers: headers,
            data: data,
        };
        if (ctx.isDebug) {
            console.log(config);
        } // Add a request interceptor
        axios_1.default.interceptors.request.use(function (config) {
            // Do something before request is sent
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });
        // Add a response interceptor
        axios_1.default.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response.data;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            return Promise.reject(error);
        });
        return axios_1.default.request(config);
        /*return new Promise<Uint8Array>((resolve, reject) => {
          const req = http
            .request(
              config,
              res => {
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => {
                  const data = Buffer.concat(chunks);
                  if (res.statusCode != 200) {
                    reject(onError(data));
                  } else {
                    resolve(data);
                  }
                });
                res.on('error', err => {
                  reject(onUnknownError(err, null));
                });
              },
            )
            .on('error', err => {
              reject(onUnknownError(err, null));
            });
          req.end(data);
        });*/
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
