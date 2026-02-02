export interface HttpRequestOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

export interface IHttpClient {

  get<T = unknown>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;

  post<T = unknown>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>>;

  put<T = unknown>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>>;

  patch<T = unknown>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>>;

  delete<T = unknown>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
}
