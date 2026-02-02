import { api } from './api';

export interface Event {
  id: number;
  title: string;
  category: string;
  location: string;
  venue: string;
  price: string;
  start_date: string;
  end_date: string;
  image: string;
  rating: number;
  attendees: number;
  featured: boolean;
  trending: boolean;
  is_sold_out: boolean;
  total_capacity: number;
  tickets_left: number | null;
}

export interface VendorEvent {
  id: number;
  title: string;
  status: string;
  visibility: string;
  start_date: string;
  end_date: string;
  total_capacity: number;
  tickets_sold: number;
  revenue: number;
  category: string;
  tickets: {
    id: number;
    name: string;
    price: string;
    quantity: number;
    sold: number;
    created_at: string;
    updated_at: string;
  }[];
  images: { id: number; url: string; is_primary: number }[];
}

export interface EventsResponse {
  status: string;
  data: Event[];
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface EventQueryParams {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  trending?: boolean;
  date_filter?: string;
  sort_by?: string;
  page?: number;
  limit?: number;
}

export const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, EventQueryParams>({
      query: (params) => ({
        url: '/events',
        method: 'GET',
        params,
      }),
    }),
    createEvent: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        data: body,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
    getVendorEvents: builder.query<{ data: VendorEvent[] }, void>({
      query: () => ({
        url: '/vendor/events',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetEventsQuery, useCreateEventMutation, useGetVendorEventsQuery } = eventApi;