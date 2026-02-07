import { api } from './api';
import { APIENDPOINTS } from '../../utils/ApiConstants';

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

export interface VendorHotel {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  status: 'active' | 'pending' | 'inactive';
  room_types_min_base_price: number;
  bookings_count: number;
  bookings_sum_total_price: number;
  reviews_count: number;
  reviews_avg_rating: number;
  created_at: string;
  images: { id: number; path: string }[];
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

export interface VendorHotelsResponse {
  status: string;
  data: VendorHotel[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
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

export interface VendorHotelQueryParams {
  status?: 'active' | 'pending' | 'inactive' | 'all';
  search?: string;
  sort_by?: 'recent' | 'price_high' | 'price_low';
  limit?: number;
  page?: number;
}

export interface RoomTierPayload {
  name: string;
  base_price: number;
  max_occupancy: number;
  total_inventory: number;
  description?: string;
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
    getVendorHotels: builder.query<VendorHotelsResponse, VendorHotelQueryParams>({
      query: (params) => ({
        url: '/vendor/hotels',
        method: 'GET',
        params,
      }),
      providesTags: ['VendorHotels'],
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
    createHotel: builder.mutation<any, FormData>({
      query: (data) => ({
        url: APIENDPOINTS.base_url_v2 + '/vendor/hotel',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['VendorHotels'],
    }),
    createRoomTiers: builder.mutation<any, { hotelId: string | number; roomTiers: RoomTierPayload[] }>({
      query: ({ hotelId, roomTiers }) => ({
        url: `/hotels/${hotelId}/room-types`,
        method: 'POST',
        data: roomTiers,
      }),
      invalidatesTags: ['VendorHotels'],
    }),
  }),
});

export const { useGetHotelsQuery, useGetHotelByIdQuery, useCreateHotelBookingMutation, useLazyGetHotelAvailabilityQuery, useGetVendorHotelsQuery, useCreateHotelMutation, useCreateRoomTiersMutation } = hotelApi;