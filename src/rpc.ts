import axios, {AxiosRequestConfig} from 'axios';
import {EncodeTwirpError, UnknownError} from "./err";
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
                const status: number = error.response.status;
                const data   = error.response.data;
                const statusText: string = error.response.statusText;
                if (status == 500) {
                    const unknown: UnknownError = {
                        message: "internal server error",
                        msg: statusText,
                        name: "something bad happened",
                        stack: undefined,
                        isUnknownError: true
                    }
                    return Promise.reject(unknown)
                }
                const twirpError = EncodeTwirpError(data)
                return Promise.reject(twirpError)
            })
    }
}