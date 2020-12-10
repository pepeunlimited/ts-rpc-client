import { Context } from "./ctx";
export declare class Rpc {
    private readonly host;
    private readonly port;
    constructor(host: string, port: number | string);
    request(ctx: Context, service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
