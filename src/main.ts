import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { HttpClientFactory, HTTP_CLIENT_KEY } from './lib';
import { API_BASE_URL } from './api/client';

const app = createApp(App);


const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const httpClient = useMock
  ? HttpClientFactory.createMock(400)
  : HttpClientFactory.createFetch(API_BASE_URL);

app.provide(HTTP_CLIENT_KEY, httpClient);

app.mount('#app');
