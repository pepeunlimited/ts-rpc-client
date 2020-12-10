"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnknownError = exports.isTwirpError = exports.TwirpError2 = exports.EncodeTwirpError = exports.DecodeTwirpError = void 0;
exports.DecodeTwirpError = (err) => {
    const isInstanceof = err instanceof TwirpError2;
    if (!isInstanceof) {
        return null;
    }
    return err;
};
exports.EncodeTwirpError = (errorData) => {
    try {
        let decoded = JSON.parse(errorData.toString());
        let argument = null;
        if (decoded.meta != null) {
            argument = decoded.meta.get('argument');
        }
        const msg = decoded.msg;
        const code = decoded.code;
        let isNotFound = false;
        if (code == 'not_found') {
            isNotFound = true;
        }
        return new TwirpError2("twirp.Error", msg, code, argument, isNotFound);
    }
    catch (error) {
        return new Error("can't decode twirp.Error");
    }
};
class TwirpError2 extends Error {
    constructor(message, msg, code, argument, isNotFound) {
        super(message);
        this.msg = msg;
        this.code = code;
        this.argument = argument;
        this.isNotFound = isNotFound;
    }
}
exports.TwirpError2 = TwirpError2;
exports.isTwirpError = (err) => {
    return !!(err instanceof Error && err.isTwirpError);
};
exports.isUnknownError = (err) => {
    return !!(err instanceof Error && err.isUnknownError);
};
