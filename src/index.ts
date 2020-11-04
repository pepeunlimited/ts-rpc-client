import http, { RequestOptions, OutgoingHttpHeaders } from 'http';

export class Context {
  private dataLoaders = new Map<string, any>();

  public userId: number | null | undefined;
  public isDebug: boolean = false;
  public clientMutationId: string|undefined

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
    return new Promise<Uint8Array>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const path = "/twirp/" + service + "/" + method;
      let headers: OutgoingHttpHeaders = {};
      headers = {
        'Content-Type': 'application/protobuf',
        'Content-Length': Buffer.byteLength(data),
      };
      if (ctx.isDebug) {
        console.log(" ---- Begin ---- ");
        console.log("SERVICE: " + service);
        console.log("METHOD: " + method);
        console.log("PATH: " + path);
        console.log("HEADERS:");
        console.log(headers);
        console.log("CTX:");
        console.log(ctx);
        console.log(" ---- End ---- ");
      }
      const config: RequestOptions = {
        hostname: this.host,
        port: this.port,
        path: path,
        method: 'POST',
        headers: headers,
      };
      const req = http
        .request(
          config,
          res => {
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
              const data = Buffer.concat(chunks);
              if (res.statusCode != 200) {
                reject(onError(data));
              } else {
                resolve(data);
              }
            });
            res.on('error', err => {
              reject(onUnknownError(err, null));
            });
          },
        )
        .on('error', err => {
          reject(onUnknownError(err, null));
        });
      req.end(data);
    });
  }
}

export type FetchError = | TwirpError | UnknownError;

function onError(data: Uint8Array): Error {
  try {
    const json = JSON.parse(data.toString());
    const error = new Error();
    (error as TwirpError).isTwirpError = true;
    if (json.meta != null) {
      (error as TwirpError).argument = json.meta['argument'];
    }
    (error as TwirpError).msg = json.msg;
    (error as TwirpError).code = json.code;
    return error;
  } catch (error) {
    return onUnknownError(error, data.toString())
  }
}

function onUnknownError(error: Error, data: string | null): Error {
  (error as UnknownError).isUnknownError = true;
  if (data == null) {
    (error as UnknownError).msg = error.message;
  } else {
    (error as UnknownError).msg = data;
  }
  return error
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