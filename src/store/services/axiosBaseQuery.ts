import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
import { APIENDPOINTS } from '../../utils/ApiConstants';
const axiosInstance = axios.create({
  baseURL: APIENDPOINTS.base_url, // Your future backend URL
});

// Axios Interceptor for Auth (Optional but recommended)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers']; // Add this
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => { // Add headers here
    try {
      // Axios will now automatically detect FormData in 'data' 
      // and set the correct Content-Type if we don't force it to JSON
      const result = await axiosInstance({ 
        url, 
        method, 
        data, 
        params, 
        headers 
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosInstance;