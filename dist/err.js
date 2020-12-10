"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnknownError = exports.isTwirpError = exports.ServerError = exports.TwirpError2 = exports.EncodeServerError = exports.EncodeNetworkError = exports.EncodeTwirpError = exports.DecodeServerError = exports.DecodeTwirpError = void 0;
/* DECODERS */
exports.DecodeTwirpError = (err) => {
    const isInstanceof = err instanceof TwirpError2;
    if (!isInstanceof) {
        return null;
    }
    return err;
};
exports.DecodeServerError = (err) => {
    const isInstanceof = err instanceof ServerError;
    if (!isInstanceof) {
        return null;
    }
    return err;
};
/* ENCODERS */
exports.EncodeTwirpError = (response) => {
    try {
        const errorData = response.data;
        let decoded = JSON.parse(errorData.toString());
        let argument = null;
        if (decoded.meta != null) {
            argument = decoded.meta.get('argument');
        }
        const msg = decoded.msg;
        const code = decoded.code;
        const errorCode = twirpErrorError(code);
        return new TwirpError2(msg, code, argument, errorCode);
    }
    catch (error) { // fallback
        return exports.EncodeServerError(response);
    }
};
function twirpErrorError(code) {
    let isNotFound = false;
    if (code == 'not_found') {
        isNotFound = true;
    }
    let isUnauthenticated = false;
    if (code == 'unauthenticated') {
        isUnauthenticated = true;
    }
    let isMalformed = false;
    if (code == 'malformed') {
        isMalformed = true;
    }
    const errorCode = {
        isNotFound: isNotFound,
        isUnauthenticated: isUnauthenticated,
        isMalformed: isMalformed
    };
    return errorCode;
}
exports.EncodeNetworkError = (error) => {
    const response = error.response;
    if (response == null) {
        const errno = error.errno;
        const code = error.code;
        const msg = error.message;
        const path = error.config.url;
        const host = error.config.baseURL;
        return new ServerError(msg, code, errno, path, host);
    }
    return exports.EncodeServerError(response);
};
exports.EncodeServerError = (response) => {
    try {
        const errorData = response.data;
        const statusCode = response.status;
        const path = response.config.url;
        const host = response.config.baseURL;
        return new ServerError("error.Server", errorData.toString(), statusCode, path, host);
    }
    catch (error) {
        return new Error("something is really broken. can't decode server error");
    }
};
/* ERRORS */
class TwirpError2 extends Error {
    constructor(msg, code, argument, errorCode) {
        super("twirp.Error");
        this.msg = msg;
        this.code = code;
        this.argument = argument;
        this.errorCode = errorCode;
    }
}
exports.TwirpError2 = TwirpError2;
class ServerError extends Error {
    constructor(msg, code, statusCode, path, host) {
        super(msg);
        this.msg = msg;
        this.code = code;
        this.statusCode = statusCode;
        this.path = path;
        this.host = host;
    }
}
exports.ServerError = ServerError;
exports.isTwirpError = (err) => {
    return !!(err instanceof Error && err.isTwirpError);
};
exports.isUnknownError = (err) => {
    return !!(err instanceof Error && err.isUnknownError);
};
