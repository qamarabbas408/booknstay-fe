import { api } from './api';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import { updateUser } from '../slices/authSlice';

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

export interface VendorRegisterRequest {
  ownerName: string;
  email: string;
  password: string;
  password_confirmation: string;
  companyName: string;
  businessType: string;
  phone: string;
  website: string;
  role?: string;
}

export interface ApprovalStatusResponse {
  message: string;
  status: 'active' | 'pending' | 'suspended' | 'unknown';
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
    registerVendor: builder.mutation<AuthResponse, VendorRegisterRequest | FormData>({
      query: (credentials) => ({
        url: APIENDPOINTS.base_url_v2 + APIENDPOINTS.ENDPOINTS.registerVendor,
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
    getApprovalStatus: builder.query<ApprovalStatusResponse, void>({
      query: () => ({
        url: APIENDPOINTS.base_url_v2 + 'approval-status',
        method: 'GET',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // On successful status check, update the user's status in the auth slice
          if (data.status) {
            dispatch(updateUser({ status: data.status }));
          }
        } catch (err) {
          // The error is already handled by the component using the query hook
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterVendorMutation, useRegisterGuestMutation, useLazyGetApprovalStatusQuery } = authApi;