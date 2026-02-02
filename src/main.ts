import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { HttpClientFactory, HTTP_CLIENT_KEY } from './lib';
import { API_BASE_URL } from './api/client';

const app = createApp(App);

app.provide(HTTP_CLIENT_KEY, HttpClientFactory.createFetch(API_BASE_URL));

app.mount('#app');
