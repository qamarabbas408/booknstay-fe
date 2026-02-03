import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
export const api = createApi({
  reducerPath: 'api',
  // Use Axios instead of fetchBaseQuery
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Hotel', 'Event', 'Booking', 'VendorEvents', 'VendorEvent'],
  endpoints: () => ({}),
});