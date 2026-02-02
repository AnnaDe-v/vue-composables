
export function buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  const separator = url.includes('?') ? '&' : '?';
  return queryString ? `${url}${separator}${queryString}` : url;
}


export function prepareBody<T>(body: T, headers: Record<string, string>): BodyInit | null {
  if (!body) return null;

  const contentType = headers['Content-Type'] || headers['content-type'];

  if (body instanceof FormData || body instanceof Blob) {
    return body as BodyInit;
  }

  if (!contentType || contentType.includes('application/json')) {
    headers['Content-Type'] = 'application/json';
    return JSON.stringify(body);
  }

  return String(body);
}


export async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');

  if (!contentType) {
    const text = await response.text();
    return (text ? text : null) as T;
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  if (contentType.includes('text/')) {
    return response.text() as Promise<T>;
  }

  if (contentType.includes('application/octet-stream')) {
    return response.blob() as Promise<T>;
  }

  try {
    return response.json();
  } catch {
    return response.text() as Promise<T>;
  }
}


export function createHttpError(
  message: string,
  status?: number,
  statusText?: string,
  data?: unknown
): Error & { status?: number; statusText?: string; data?: unknown } {
  const error = new Error(message) as Error & {
    status?: number;
    statusText?: string;
    data?: unknown;
  };
  error.status = status;
  error.statusText = statusText;
  error.data = data;
  return error;
}


export function isMethodWithBody(method: string): boolean {
  return ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase());
}


export function getDefaultHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
