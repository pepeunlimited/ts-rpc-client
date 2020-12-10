import axios, {AxiosRequestConfig} from 'axios';
import {
    DecodeServerError,
    EncodeNetworkError,
    EncodeTwirpError,
} from "./err";
import {Context} from "./ctx";

export class Rpc {

    private readonly host: string;
    private readonly port: number|string;

    constructor(host: string, port: number|string) {
        this.host = host;
        this.port = port;
    }

    request(ctx: Context, service: string, method: string, data: Uint8Array): Promise<Uint8Array> {
        const path = '/twirp/'+service+'/'+method;
        const config: AxiosRequestConfig = {
            baseURL: 'http://'+this.host+':'+this.port,
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
            console.log(config)
        }
        return axios.request(config)
            .then((response) => {
                return response.data;
            }).catch((error) => {
                const serverError = EncodeNetworkError(error)
                const decoded = DecodeServerError(serverError)
                const code: string = decoded!.code
                if (code == 'EADDRINUSE'
                    || code == 'ECONNREFUSED'
                    || code == 'ECONNRESET'
                    || code == 'EPIPE'
                    || code == 'ETIMEDOUT'
                    || code == 'ENOTFOUND'
                ) {
                    return Promise.reject(serverError)
                } else if (decoded?.statusCode == 500) {
                    return Promise.reject(serverError)
                }
                const twirpError = EncodeTwirpError(error.response)
                return Promise.reject(twirpError)
            })
    }
}