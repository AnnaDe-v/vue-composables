import { inject } from 'vue';
import type { IHttpClient } from '../ports';
import { HTTP_CLIENT_KEY } from '../lib';

export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';


export function useHttpClient(): IHttpClient {
  const client = inject(HTTP_CLIENT_KEY);
  
  if (!client) {
    throw new Error(
      'HTTP client not provided'
    );
  }
  
  return client;
}


export function buildApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  let url = endpoint;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
