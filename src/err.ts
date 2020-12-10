import {AxiosResponse} from "axios";
import {ApolloError, AuthenticationError, ForbiddenError} from "apollo-server-errors";


/* DECODERS */

export const DecodeTwirpError = (err: any): TwirpError2|null => {
    const isInstanceof = err instanceof TwirpError2
    if (!isInstanceof) {
        return null;
    }
    return err as TwirpError2
}

export const DecodeServerError = (err: any): ServerError|null => {
    const isInstanceof = err instanceof ServerError
    if (!isInstanceof) {
        return null
    }
    return err as ServerError
}

/* ENCODERS */

export const EncodeTwirpError = (response: AxiosResponse): Error => {
    try {
        const errorData = response.data;
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
        return new TwirpError2(msg, code, argument, isNotFound)
    } catch (error) { // fallback
        return EncodeServerError(response)
    }
}

export const EncodeNetworkError = (error: any): Error => {
    const response: AxiosResponse|null = error.response
    if (response == null) {
        const errno:number = error.errno
        const code: string = error.code
        const msg: string = error.message
        const path: string = error.config.url;
        const host: string = error.config.baseURL;
        return new ServerError(msg, code, errno, path, host)
    }
    return EncodeServerError(response)
}

export const EncodeServerError = (response: AxiosResponse): Error => {
    try {
        const errorData   = response.data;
        const statusCode: number = response.status;
        const path: string = response.config.url!;
        const host: string = response.config.baseURL!;
        return new ServerError("error.Server", errorData.toString(), statusCode, path, host)
    } catch (error) {
        return new Error("something is really broken. can't decode server error")
    }
}

/* MESSAGES */

interface TwirpErrorMessage {
    msg: string
    code: string
    meta?: Map<string, any>
}

/* ERRORS */

export class TwirpError2 extends Error {
    msg:            string
    code:           string;
    argument:       string|null;
    isNotFound:     boolean;
    constructor(msg: string, code: string, argument: string|null, isNotFound: boolean) {
        super("twirp.Error");
        this.msg = msg
        this.code = code;
        this.argument = argument;
        this.isNotFound = isNotFound;
    }
}

export class ServerError extends Error {

    statusCode: number
    code: string
    path: string
    host: string
    msg: string

    constructor(msg: string, code: string, statusCode: number, path: string, host: string) {
        super(msg);
        this.msg = msg
        this.code = code
        this.statusCode = statusCode;
        this.path = path
        this.host = host
    }
}

/* GraphQL Apollo ERRORS */

export class InternalServerError extends ApolloError {

    constructor(msg: string) {
        super(msg, "INTERNAL_SERVER_ERROR");
    }
}

export class NotFoundError extends ApolloError {

    constructor(msg: string) {
        super(msg, "NOT_FOUND");
    }
}

export class PermissionDeniedNotFoundError extends ForbiddenError {

    constructor(msg: string) {
        super(msg);
    }
}

export class AlreadyExistError extends ApolloError {

    constructor(msg: string) {
        super(msg, "ALREADY_EXIST");
    }
}

export class AccessDeniedError extends ApolloError {

    constructor(msg: string) {
        super(msg, "ACCESS_DENIED");
    }
}

export function throwAccessRefreshTokenError(error: TwirpError) {
    if (error.msg == 'access_token_malformed'  ||
        error.msg == 'refresh_token_malformed' ||
        error.msg == 'refresh_token_expired'   ||
        error.msg == 'access_token_expired') {
        throw new AuthenticationError(error.msg)
    }
}

export function throwIfAccessDeniedError(error: Error) {
    if (!(error instanceof ForbiddenError)) {
        return
    }
    const accessDenied = error as ForbiddenError
    if (accessDenied.message == "ACCESS_DENIED") {
        throw new AccessDeniedError("ACCESS_DENIED")
    }
}

/* OLD SHIT */

export interface TwirpError extends Error {
    isTwirpError:   boolean
    code:           string
    msg:            string
    argument:       string
    isNotFound:     boolean
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