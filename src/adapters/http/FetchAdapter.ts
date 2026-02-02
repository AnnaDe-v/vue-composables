import { useHttp } from '../../composables';
import type { IHttpClient, HttpRequestOptions, HttpResponse } from '../../ports/IHttpClient';

export class FetchAdapter implements IHttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  async get<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const { request, data, status, statusText } = useHttp<T>({
      url: this.buildUrl(url),
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options?.headers },
      params: options?.params,
      timeout: options?.timeout,
    });

    const response = await request();
    
    if (!response) {
      throw new Error('Request failed');
    }

    return {
      data: data.value as T,
      status: status.value || 0,
      statusText: statusText.value || '',
      headers: response.headers,
      ok: response.ok,
    };
  }

  async post<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const { request, data, status, statusText } = useHttp<T>({
      url: this.buildUrl(url),
      method: 'POST',
      headers: { ...this.defaultHeaders, ...options?.headers },
      body,
      params: options?.params,
      timeout: options?.timeout,
    });

    const response = await request();
    
    if (!response) {
      throw new Error('Request failed');
    }

    return {
      data: data.value as T,
      status: status.value || 0,
      statusText: statusText.value || '',
      headers: response.headers,
      ok: response.ok,
    };
  }

  async put<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const { request, data, status, statusText } = useHttp<T>({
      url: this.buildUrl(url),
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...options?.headers },
      body,
      params: options?.params,
      timeout: options?.timeout,
    });

    const response = await request();
    
    if (!response) {
      throw new Error('Request failed');
    }

    return {
      data: data.value as T,
      status: status.value || 0,
      statusText: statusText.value || '',
      headers: response.headers,
      ok: response.ok,
    };
  }

  async patch<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const { request, data, status, statusText } = useHttp<T>({
      url: this.buildUrl(url),
      method: 'PATCH',
      headers: { ...this.defaultHeaders, ...options?.headers },
      body,
      params: options?.params,
      timeout: options?.timeout,
    });

    const response = await request();
    
    if (!response) {
      throw new Error('Request failed');
    }

    return {
      data: data.value as T,
      status: status.value || 0,
      statusText: statusText.value || '',
      headers: response.headers,
      ok: response.ok,
    };
  }

  async delete<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const { request, data, status, statusText } = useHttp<T>({
      url: this.buildUrl(url),
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...options?.headers },
      params: options?.params,
      timeout: options?.timeout,
    });

    const response = await request();
    
    if (!response) {
      throw new Error('Request failed');
    }

    return {
      data: data.value as T,
      status: status.value || 0,
      statusText: statusText.value || '',
      headers: response.headers,
      ok: response.ok,
    };
  }
}
