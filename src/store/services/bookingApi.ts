import { api } from './api';
import type { PricingDetails } from './hotelApi';

export interface Location {
  id: number;
  country: string;
  city: string;
  full_address: string;
  zip_code: string;
  latitude: string;
  longitude: string;
}
export interface BookingPriceDetails extends PricingDetails {
  totalPaid: number;
  currency: string;

}
export interface Booking {
  id: number;
  type: 'hotel' | 'event';
  title: string;
  location: string | Location | null;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  price: number;
  bookingCode: string;
  image: string | null;
  guestsOrTickets: string;
  dates: string;
  checkIn?: string;
  checkOut?: string;
  bookedAt?: string;
  priceDetails: BookingPriceDetails;
  itemDetails: {
    name : string, 
    description?: string,
  }

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
