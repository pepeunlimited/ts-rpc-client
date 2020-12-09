import axios, {AxiosRequestConfig} from 'axios';

export class Context {
  public dataLoaders = new Map<string, any>();

  public userId: number | null | undefined;
  public isDebug: boolean = false;
  public apolloOperationId: string|undefined

  getDataLoader<T>(id: string, cstr: () => T): T {
    if (!this.dataLoaders.has(id)) {
      this.dataLoaders.set(id, cstr());
    }
    return this.dataLoaders.get(id);
  }
}

export class Rpc {

  private readonly host: string;
  private readonly port: number|string;

  constructor(host: string, port: number|string) {
    this.host = host;
    this.port = port;
  }

  request(ctx: Context, service: string, method: string, data: Uint8Array): Promise<Uint8Array> {
    const path = "/twirp/" + service + "/" + method;
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
          let twirpError: TwirpError = JSON.parse(data.toString());
          twirpError.isTwirpError = true
          return Promise.reject(twirpError)
        })
  }
}

export interface TwirpError extends Error {
  isTwirpError:   boolean
  code:           string
  msg:            string
  argument:       string
}

export interface UnknownError extends Error {
  isUnknownError: boolean
  msg:            string
}

export const isTwirpError = (
    err: TwirpError | any,
): err is TwirpError => {
  return !!(err instanceof Error && (err as TwirpError).isTwirpError);
};

export const isUnknownError = (
    err: UnknownError | any,
): err is UnknownError => {
  return !!(err instanceof Error && (err as UnknownError).isUnknownError);
};