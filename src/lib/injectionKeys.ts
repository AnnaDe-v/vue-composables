import type { InjectionKey } from 'vue';
import type { IHttpClient } from '../ports';


export const HTTP_CLIENT_KEY: InjectionKey<IHttpClient> = Symbol('httpClient');
