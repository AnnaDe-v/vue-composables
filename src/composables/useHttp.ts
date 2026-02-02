import { ref, computed, reactive, toRefs } from 'vue';
import type { HttpOptions, HttpState, HttpResponse } from '../types/http';
import {
  buildUrl,
  prepareBody,
  parseResponse,
  createHttpError,
  isMethodWithBody,
  getDefaultHeaders,
} from '../utils';


export function useHttp<T = unknown, B = unknown>(options: HttpOptions<B>) {
  const abortController = ref<AbortController | null>(null);

  const state: HttpState<T> = reactive({
    data: null,
    status: null,
    statusText: '',
    loading: false,
    error: null,
    success: false,
  });

  const hasError = computed(() => state.error !== null);


  const request = async (overrideOptions?: Partial<HttpOptions<B>>): Promise<HttpResponse<T> | null> => {

    const finalOptions = { ...options, ...overrideOptions };
    
    if (overrideOptions?.url) {
      const overrideUrl = overrideOptions.url;
      const baseUrl = options.url;
      
      if (overrideUrl.startsWith('/') && baseUrl.includes('://')) {
        const urlObj = new URL(baseUrl);
        finalOptions.url = `${urlObj.origin}${overrideUrl}`;
      }
    }
    
    const method = finalOptions.method || 'GET';
    const timeout = finalOptions.timeout || 30000;

    state.loading = true;
    state.error = null;
    state.success = false;

    abortController.value = new AbortController();

    try {
      const url = buildUrl(finalOptions.url, finalOptions.params);

      const headers = {
        ...getDefaultHeaders(),
        ...finalOptions.headers,
      };

      const body = isMethodWithBody(method) && finalOptions.body
        ? prepareBody(finalOptions.body, headers)
        : null;

      const timeoutId = setTimeout(() => {
        if (abortController.value) {
          abortController.value.abort();
        }
      }, timeout);

      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: abortController.value.signal,
        credentials: finalOptions.credentials,
        mode: finalOptions.mode,
        cache: finalOptions.cache,
      });

      clearTimeout(timeoutId);

      state.status = response.status;
      state.statusText = response.statusText;

      if (!response.ok) {
        const errorData = await parseResponse(response);
        throw createHttpError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          errorData
        );
      }

      const data = await parseResponse<T>(response);
      
      state.data = data as T;
      state.success = true;

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        ok: response.ok,
      };
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          state.error = createHttpError('Request was cancelled');
        } else {
          state.error = err;
        }
      } else {
        state.error = createHttpError('Unknown error occurred');
      }
      
      return null;
    } finally {
      state.loading = false;
      abortController.value = null;
    }
  };

  const abort = () => {
    if (abortController.value) {
      abortController.value.abort();
      abortController.value = null;
    }
  };


  const reset = () => {
    state.data = null;
    state.status = null;
    state.statusText = '';
    state.loading = false;
    state.error = null;
    state.success = false;
  };

  return {
    ...toRefs(state),
    
    hasError,
    
    request,
    abort,
    reset,
  };
}
