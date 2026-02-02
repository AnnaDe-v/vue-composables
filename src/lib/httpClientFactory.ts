import type { IHttpClient } from '../ports/IHttpClient';
import { FetchAdapter } from '../adapters/http/FetchAdapter';

export type HttpClientType = 'fetch'; // axios, mock

export interface HttpClientConfig {
  type: HttpClientType;
  baseUrl: string;
  headers?: Record<string, string>;
}


export class HttpClientFactory {


  static create(config: HttpClientConfig): IHttpClient {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    };

    switch (config.type) {
      case 'fetch':
        return new FetchAdapter(config.baseUrl, defaultHeaders);
      

      default:
        throw new Error(`Unknown HTTP client type: ${config.type}`);
    }
  }

  static createFetch(baseUrl: string, headers?: Record<string, string>): IHttpClient {
    return this.create({
      type: 'fetch',
      baseUrl,
      headers,
    });
  }

}
