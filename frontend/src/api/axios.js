import axios from 'axios';
import { mockDispatch, isMockMode } from './mockService';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Mock interceptor ────────────────────────────────────────────────────────
// When running on GitHub Pages (no backend), intercept ALL requests and
// route them to the in-browser mock service instead.
API.interceptors.request.use(async (config) => {
  if (!isMockMode()) return config;

  // Extract path relative to baseURL  e.g. "/auth/login"
  const baseURL = config.baseURL || '';
  const fullUrl = config.url?.startsWith('http')
    ? config.url
    : baseURL + (config.url || '');

  // Parse query params from params object
  const queryParams = config.params || {};

  // Body data
  const body = config.data
    ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data)
    : {};

  // Strip base URL to get just the path portion for matching
  const urlPath = fullUrl.replace(/^https?:\/\/[^/]+/, '');

  try {
    const result = await mockDispatch(config.method?.toUpperCase() || 'GET', urlPath, body, queryParams);
    // Abort the real HTTP request and return mock response
    const cancelSource = axios.CancelToken.source();
    config.cancelToken = cancelSource.token;
    cancelSource.cancel({ __mockResult: result });
  } catch (mockError) {
    // Mock threw an error — cancel real request and re-throw mock error
    const cancelSource = axios.CancelToken.source();
    config.cancelToken = cancelSource.token;
    cancelSource.cancel({ __mockError: mockError });
  }

  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    // ── Handle mock cancellations ────────────────────────────────────────
    if (axios.isCancel(err)) {
      if (err.message?.__mockResult) {
        // Successful mock response — return as resolved axios response
        return Promise.resolve({
          data: err.message.__mockResult.data,
          status: 200,
          statusText: 'OK (Mock)',
          headers: {},
          config: {},
        });
      }
      if (err.message?.__mockError) {
        // Failed mock response — re-throw with axios-compatible shape
        return Promise.reject(err.message.__mockError);
      }
    }

    // ── Real 401 handler ─────────────────────────────────────────────────
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('ems_token');
      localStorage.removeItem('ems_user');
      window.location.href = '/Employee_management_system/login';
    }
    return Promise.reject(err);
  }
);

export default API;
