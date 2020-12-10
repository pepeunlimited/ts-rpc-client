import { AxiosResponse } from "axios";
export declare const DecodeTwirpError: (err: any) => TwirpError2 | null;
export declare const DecodeServerError: (err: any) => ServerError | null;
export declare const EncodeTwirpError: (response: AxiosResponse) => Error;
export declare const EncodeNetworkError: (error: any) => Error;
export declare const EncodeServerError: (response: AxiosResponse) => Error;
export declare class TwirpError2 extends Error {
    msg: string;
    code: string;
    argument: string | null;
    isNotFound: boolean;
    constructor(msg: string, code: string, argument: string | null, isNotFound: boolean);
}
export declare class ServerError extends Error {
    statusCode: number;
    code: string;
    path: string;
    host: string;
    constructor(msg: string, code: string, statusCode: number, path: string, host: string);
}
export interface TwirpError extends Error {
    isTwirpError: boolean;
    code: string;
    msg: string;
    argument: string;
    isNotFound: boolean;
}
export interface UnknownError extends Error {
    isUnknownError: boolean;
    msg: string;
}
export declare const isTwirpError: (err: TwirpError | any) => err is TwirpError;
export declare const isUnknownError: (err: UnknownError | any) => err is UnknownError;
