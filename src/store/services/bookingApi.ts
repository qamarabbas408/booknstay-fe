import { api } from './api';

export interface Booking {
  id: number;
  type: 'hotel' | 'event';
  title: string;
  location: string | null;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  price: number;
  bookingCode: string;
  image: string | null;
  guestsOrTickets: string;
  dates: string;
  checkIn?: string;
  checkOut?: string;
  bookedAt?: string;
}

export interface BookingsResponse {
  status: string;
  data: Booking[];
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface GetBookingsParams {
  type?: 'hotel' | 'event' | 'all';
  tab?: 'upcoming' | 'past';
  page?: number;
  search?: string;
}

export const bookingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGuestBookings: builder.query<BookingsResponse, GetBookingsParams>({
      query: (params) => ({
        url: '/guest/bookings',
        method: 'GET',
        params: {
          ...params,
          type: params.type === 'all' ? undefined : params.type,
        },
      }),
      providesTags: ['Booking'],
    }),
    getBookingById: builder.query<{ data: Booking }, number>({
      query: (id) => ({
        url: `/guest/bookings/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),
  }),
});

export const { useGetGuestBookingsQuery, useGetBookingByIdQuery } = bookingApi;
