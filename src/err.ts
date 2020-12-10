export const DecodeTwirpError = (err: any): TwirpError2|null => {
    const isInstanceof = err instanceof TwirpError2
    if (!isInstanceof) {
        return null;
    }
    return err as TwirpError2
}

export const EncodeTwirpError = (errorData: any): Error => {
    try {
        let decoded: TwirpErrorMessage = JSON.parse(errorData.toString());
        let argument: string|null = null;
        if (decoded.meta != null) {
            argument = decoded.meta.get('argument')!
        }
        const msg: string = decoded.msg;
        const code: string = decoded.code;
        let isNotFound: boolean = false
        if (code == 'not_found') {
            isNotFound = true
        }
        return new TwirpError2("twirp.Error", msg, code, argument, isNotFound)
    } catch (error) {
        return new Error("can't decode twirp.Error")
    }
}

interface TwirpErrorMessage {
    msg: string
    code: string
    meta?: Map<string, any>
}

export interface TwirpError extends Error {
    isTwirpError:   boolean
    code:           string
    msg:            string
    argument:       string
    isNotFound:     boolean
}


export class TwirpError2 extends Error {
    msg:            string
    code:           string;
    argument:       string|null;
    isNotFound:     boolean;
    constructor(message: string, msg: string, code: string, argument: string|null, isNotFound: boolean) {
        super(message);
        this.msg = msg
        this.code = code;
        this.argument = argument;
        this.isNotFound = isNotFound;
    }
}

export interface InternalServerError extends Error {

}

export interface UnknownError extends Error {
    isUnknownError: boolean
    msg:            string
}

export const isTwirpError = (err: TwirpError | any,): err is TwirpError => {
    return !!(err instanceof Error && (err as TwirpError).isTwirpError);
};

export const isUnknownError = (
    err: UnknownError | any,
): err is UnknownError => {
    return !!(err instanceof Error && (err as UnknownError).isUnknownError);
};