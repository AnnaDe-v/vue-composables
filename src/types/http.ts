export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface HttpOptions<T = unknown> {
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: T;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
}

export interface HttpState<T = unknown> {
  data: T | null;
  status: number | null;
  statusText: string;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

export interface HttpInterceptors {
  request?: (config: HttpOptions) => HttpOptions | Promise<HttpOptions>;
  response?: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>;
  error?: (error: Error) => Error | Promise<Error>;
}
