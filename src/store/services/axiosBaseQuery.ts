import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import {type RootState } from '../index';
 const axiosInstance = axios.create({
  baseURL: APIENDPOINTS.base_url, // Your future backend URL
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
  async ({ url, method, data, params, headers }, { getState, dispatch }) => {
    const token = (getState() as RootState).auth.token;
    try {
      // Axios will now automatically detect FormData in 'data' 
      // and set the correct Content-Type if we don't force it to JSON
      const result = await axiosInstance({ 
        url, 
        method, 
        data, 
        params, 
        headers: {
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },

      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

       if (err.response?.status === 401) {
        // Dispatch the logout action by its type string to avoid circular dependencies.
        // The authSlice.name is 'auth' and the reducer name is 'logout', so the type is 'auth/logout'.
        dispatch({ type: 'auth/logout' });
        window.location.href = '/login';
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,        },      };
    }
  };
export default axiosInstance;