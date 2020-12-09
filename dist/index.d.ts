export declare class Context {
    private dataLoaders;
    userId: number | null | undefined;
    isDebug: boolean;
    apolloOperationId: string | undefined;
    getDataLoader<T>(id: string, cstr: () => T): T;
}
export declare class Rpc {
    private readonly host;
    private readonly port;
    constructor(host: string, port: number | string);
    request(ctx: Context, service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
export declare type FetchError = TwirpError | UnknownError;
export interface TwirpError extends Error {
    isTwirpError: boolean;
    code: string;
    msg: string;
    argument: string;
}
export interface UnknownError extends Error {
    isUnknownError: boolean;
    msg: string;
}
export declare const isTwirpError: (err: TwirpError | any) => err is TwirpError;
export declare const isUnknownError: (err: UnknownError | any) => err is UnknownError;
