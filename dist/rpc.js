"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var Rpc = (function () {
    function Rpc(host, port) {
        this.host = host;
        this.port = port;
    }
    Rpc.prototype.request = function (service, method, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var chunks = [];
            var path = "/twirp/" + service + "/" + method;
            var req = http_1.default
                .request({
                hostname: _this.host,
                port: _this.port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/protobuf',
                    'Content-Length': Buffer.byteLength(data),
                },
            }, function (res) {
                res.on('data', function (chunk) { return chunks.push(chunk); });
                res.on('end', function () {
                    var data = Buffer.concat(chunks);
                    if (res.statusCode != 200) {
                        reject(onError(data));
                    }
                    else {
                        resolve(data);
                    }
                });
                res.on('error', function (err) {
                    reject(onUnknownError(err, null));
                });
            })
                .on('error', function (err) {
                reject(onUnknownError(err, null));
            });
            req.end(data);
        });
    };
    return Rpc;
}());
function onError(data) {
    try {
        var json = JSON.parse(data.toString());
        var error = new Error();
        error.isTwirpError = true;
        error.reason = json.meta['reason'];
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
exports.isTwirpError = function (err) {
    return !!(err instanceof Error && err.isTwirpError);
};
exports.isUnknownError = function (err) {
    return !!(err instanceof Error && err.isUnknownError);
};
