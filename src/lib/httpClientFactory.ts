import type { IHttpClient } from '../ports/IHttpClient';
import { FetchAdapter } from '../adapters/http/FetchAdapter';
import { MockAdapter } from '../adapters/http/MockAdapter';

export type HttpClientType = 'fetch' | 'mock'; // axios

export interface HttpClientConfig {
  type: HttpClientType;
  baseUrl: string;
  headers?: Record<string, string>;
  mockDelayMs?: number;
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
      case 'mock':
        return new MockAdapter(config.mockDelayMs ?? 300);
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

  static createMock(delayMs?: number): IHttpClient {
    return this.create({
      type: 'mock',
      baseUrl: '',
      mockDelayMs: delayMs,
    });
  }
}
