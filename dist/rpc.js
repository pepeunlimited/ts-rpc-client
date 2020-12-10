"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rpc = void 0;
const axios_1 = __importDefault(require("axios"));
const err_1 = require("./err");
class Rpc {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    request(ctx, service, method, data) {
        const path = '/twirp/' + service + '/' + method;
        const config = {
            baseURL: 'http://' + this.host + ':' + this.port,
            method: 'POST',
            url: path,
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/protobuf',
                'Content-Type': 'application/protobuf',
                'Content-Length': Buffer.byteLength(data),
            },
            data: data,
            decompress: false,
        };
        if (ctx.isDebug) {
            console.log(config);
        }
        return axios_1.default.request(config)
            .then((response) => {
            return response.data;
        }).catch((error) => {
            const serverError = err_1.EncodeNetworkError(error);
            const decoded = err_1.DecodeServerError(serverError);
            const code = decoded.code;
            if (code == 'EADDRINUSE'
                || code == 'ECONNREFUSED'
                || code == 'ECONNRESET'
                || code == 'EPIPE'
                || code == 'ETIMEDOUT'
                || code == 'ENOTFOUND') {
                return Promise.reject(serverError);
            }
            else if (decoded?.statusCode == 500) {
                return Promise.reject(serverError);
            }
            const twirpError = err_1.EncodeTwirpError(error.response);
            return Promise.reject(twirpError);
        });
    }
}
exports.Rpc = Rpc;
