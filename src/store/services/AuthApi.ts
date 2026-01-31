import { api } from './api';
import { APIENDPOINTS } from '../../utils/ApiConstants';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  interests?: number[];
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: APIENDPOINTS.ENDPOINTS.login,
        method: 'POST',
        data: credentials,
      }),
    }),
    registerVendor: builder.mutation<AuthResponse, RegisterRequest | FormData>({
      query: (credentials) => ({
        url: APIENDPOINTS.ENDPOINTS.registerVendor,
        method: 'POST',
        data: credentials,
      }),
    }),
    registerGuest : builder.mutation<AuthResponse, RegisterRequest | FormData>({
      query: (credentials) => ({
        url: APIENDPOINTS.ENDPOINTS.registerGuest,
        method: 'POST',
        data: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterVendorMutation,useRegisterGuestMutation } = authApi;