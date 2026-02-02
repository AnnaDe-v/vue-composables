import { reactive, toRefs } from 'vue';
import { useHttpClient, buildApiUrl } from './client';
import type { IHttpClient } from '../ports';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from './types';


let cachedClient: IHttpClient | null = null;

function getApiClient(): IHttpClient {
  if (!cachedClient) {
    cachedClient = useHttpClient();
  }
  return cachedClient;
}

export function useGetUsers() {
  const client = getApiClient();
  
  const state = reactive({
    loading: false,
    error: null as Error | null,
    data: null as User[] | null,
    success: false,
  });

  const request = async () => {
    state.loading = true;
    state.error = null;
    state.success = false;

    try {
      const response = await client.get<User[]>('/users');
      state.data = response.data;
      state.success = true;
      return response;
    } catch (err) {
      state.error = err instanceof Error ? err : new Error('Unknown error');
      return null;
    } finally {
      state.loading = false;
    }
  };

  return {
    ...toRefs(state),
    request,
  };
}


export function useCreateUser() {
  const client = getApiClient();
  
  const state = reactive({
    loading: false,
    error: null as Error | null,
    data: null as CreateUserResponse | null,
    success: false,
  });

  const request = async (options: { body: CreateUserDto }) => {
    state.loading = true;
    state.error = null;
    state.success = false;

    try {
      const response = await client.post<CreateUserResponse>('/users', options.body);
      state.data = response.data;
      state.success = true;
      return response;
    } catch (err) {
      state.error = err instanceof Error ? err : new Error('Unknown error');
      return null;
    } finally {
      state.loading = false;
    }
  };

  return {
    ...toRefs(state),
    request,
  };
}


export function useUpdateUser() {
  const client = getApiClient();
  
  const state = reactive({
    loading: false,
    error: null as Error | null,
    data: null as UpdateUserResponse | null,
    success: false,
  });

  const request = async (options: { params: { id: number }; body: UpdateUserDto }) => {
    state.loading = true;
    state.error = null;
    state.success = false;

    try {
      const url = buildApiUrl('/users/:id', options.params);
      const response = await client.put<UpdateUserResponse>(url, options.body);
      state.data = response.data;
      state.success = true;
      return response;
    } catch (err) {
      state.error = err instanceof Error ? err : new Error('Unknown error');
      return null;
    } finally {
      state.loading = false;
    }
  };

  return {
    ...toRefs(state),
    request,
  };
}


export function useDeleteUser() {
  const client = getApiClient();
  
  const state = reactive({
    loading: false,
    error: null as Error | null,
    success: false,
    status: null as number | null,
  });

  const request = async (options: { params: { id: number } }) => {
    state.loading = true;
    state.error = null;
    state.success = false;

    try {
      const url = buildApiUrl('/users/:id', options.params);
      const response = await client.delete<DeleteUserResponse>(url);
      state.status = response.status;
      state.success = true;
      return response;
    } catch (err) {
      state.error = err instanceof Error ? err : new Error('Unknown error');
      return null;
    } finally {
      state.loading = false;
    }
  };

  return {
    ...toRefs(state),
    request,
  };
}
