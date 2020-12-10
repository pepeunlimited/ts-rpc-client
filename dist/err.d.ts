export declare const DecodeTwirpError: (err: any) => TwirpError2 | null;
export declare const EncodeTwirpError: (errorData: any) => Error;
export interface TwirpError extends Error {
    isTwirpError: boolean;
    code: string;
    msg: string;
    argument: string;
    isNotFound: boolean;
}
export declare class TwirpError2 extends Error {
    msg: string;
    code: string;
    argument: string | null;
    isNotFound: boolean;
    constructor(message: string, msg: string, code: string, argument: string | null, isNotFound: boolean);
}
export interface InternalServerError extends Error {
}
export interface UnknownError extends Error {
    isUnknownError: boolean;
    msg: string;
}
export declare const isTwirpError: (err: TwirpError | any) => err is TwirpError;
export declare const isUnknownError: (err: UnknownError | any) => err is UnknownError;
