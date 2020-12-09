import http, { RequestOptions, OutgoingHttpHeaders } from 'http';

import axios, {AxiosRequestConfig} from 'axios';
import {Order} from "ts-jemma-genproto/dist/protobuf/resources/order";

export class Context {
  private dataLoaders = new Map<string, any>();

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
    const chunks: Buffer[] = [];
    const path = "/twirp/" + service + "/" + method;
    let headers: OutgoingHttpHeaders = {};
    headers = {
      'Accept': 'application/protobuf',
      'Content-Type': 'application/protobuf',
      'Content-Length': Buffer.byteLength(data),
    };
    const config: AxiosRequestConfig = {
      baseURL: 'http://'+this.host+':'+this.port,
      method: 'POST',
      url: path,
      responseType: 'arraybuffer',
      headers: headers,
      data: data,
      decompress: false,
    };
    if (ctx.isDebug) {
      console.log(config)
    }// Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      //console.log(response.statusText)
      //console.log(response.config)
      //console.log(String.fromCharCode.apply(null, response.data));

      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    });
    return axios.request(config).then((response) => {
      return response.data;
    });




    /*return new Promise<Uint8Array>((resolve, reject) => {
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
    });*/
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