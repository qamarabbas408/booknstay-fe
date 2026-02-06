import { api } from './api';

export interface Hotel {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  image: string;
  stars: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  amenities: string[];
  badges?: string[];
  description?: string;
  descripton?: string; // Handling API typo
}

export interface HotelAvailabilityResponse {
  status: string;
  message: string;
  data: {
    hotel_id: number;
    total_rooms: number;
    occupied_rooms: number;
    available_rooms: number;
    is_available: boolean;
  };
}

export interface HotelsResponse {
  status: string;
  data: Hotel[];
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface HotelQueryParams {
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  page?: number;
  limit?: number;
  amenities?: string[];
  stars?: number[];
}

export const hotelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query<HotelsResponse, HotelQueryParams>({
      query: (params) => {
        const { amenities, stars, ...rest } = params;
        const queryParams: Record<string, any> = { ...rest };
        if (amenities && amenities.length > 0) {
          queryParams['amenities[]'] = amenities;
        }
        if (stars && stars.length > 0) {
          queryParams['stars[]'] = stars;
        }
        return {
          url: '/hotels',
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getHotelById: builder.query<{ data: Hotel }, number>({
      query: (id) => ({
        url: `/hotel/${id}`,
        method: 'GET',
      }),
    }),
    getHotelAvailability: builder.query<HotelAvailabilityResponse, { hotelId: number; check_in: string; check_out: string }>({
      query: ({ hotelId, check_in, check_out }) => ({
        url: `/hotel/${hotelId}/availability`,
        params: { check_in, check_out },
        method: 'GET',
      }),
    }),
    createHotelBooking: builder.mutation<any, { hotel_id: number; check_in: string; check_out: string; guests_count: number }>({
      query: (data) => ({
        url: '/guest/hotel/booking',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const { useGetHotelsQuery, useGetHotelByIdQuery, useCreateHotelBookingMutation, useLazyGetHotelAvailabilityQuery } = hotelApi;