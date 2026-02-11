import { api } from './api';
import { APIENDPOINTS } from '../../utils/ApiConstants';
export interface Gallery {
  id: number,
  url: string,
  is_primary: boolean,
}
export interface HotelAmenity {
  name: string;
  icon: string;
}

export interface HotelLocation {
  city: string;
  country: string;
  full_address: string;
  lat: string;
  lng: string;
}

export interface PricingDetails {
  base_price: number;
  tax_percentage: number;
  service_fee: number;
  currency: string;
}

export interface RoomTier {
  id: number;
  type: string;
  description: string;
  price: number;
  base_price: number;
  max_occupancy: number;
  total_inventory: number;
  status: string;
  available: number;
  is_locked: boolean;
  active_bookings_count: number;
  name: string,
  max_guests?: number
}

//public hotel resource
//public hotel resource
export interface Hotel {
  id: number;
  name: string;
  description: string;
  stars: number;
  pricePerNight: number;
  totalStartingPrice: number;
  starting_price: number;
  pricing_details: PricingDetails;
  location: HotelLocation;
  image: string;
  rating: number;
  reviews: number;
  reviewCount: number;
  amenities: HotelAmenity[];
  room_tiers: RoomTier[];

  // Legacy/Optional fields
  location_summary?: string;
  thumbnail?: string;
  featured?: boolean;
  badges?: string[];
  gallery?: any[];
  status?: string;
  bookings?: number;
  revenue?: number;
  createdAt?: string;
  roomTiers?: RoomTier[];
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
  createdAt: string;
  room_types_count: number;
  images: { id: number; path: string }[];
  gallery: Gallery[];
  location: HotelLocation;
  amenities: HotelAmenity[];
  star_rating?: number;
  room_tiers?: RoomTier[];
  property_type?: string;
  total_rooms?: number;
  base_price?: number;
  currency?: string;
  tax_rate?: number;
  service_charge?: number;
  cancellation_policy?: string;
  house_rules?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
}

export interface HotelAvailabilityRoomTier {
  room_type_id: number;
  name: string;
  base_price: number;
  max_occupancy: number;
  total_inventory: number;
  available_count: number;
  is_available: boolean;
}

export interface HotelAvailabilityResponse {
  status: string;
  message: string;
  data: {
    hotel_name: string;
    check_in: string;
    check_out: string;
    room_tiers: HotelAvailabilityRoomTier[];
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
    getVendorHotelById: builder.query<{ data: VendorHotel }, number>({
      query: (id) => ({
        url: `/vendor/hotels/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'VendorHotels', id }],
    }),
    getHotelAvailability: builder.query<HotelAvailabilityResponse, { hotelId: number; check_in: string; check_out: string }>({
      query: ({ hotelId, check_in, check_out }) => ({
        url: `/hotel/${hotelId}/availability`,
        params: { check_in, check_out },
        method: 'GET',
      }),
    }),
    createHotelBooking: builder.mutation<any, { hotel_id: number; check_in: string; check_out: string; guests_count: number; rooms_count: number; room_type_id: number }>({
      query: (data) => ({
        // url: '/guest/hotel/booking',
        url: APIENDPOINTS.base_url_v2 + '/guest/hotel/booking',
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
    updateHotel: builder.mutation<any, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: APIENDPOINTS.base_url_v2 + `/vendor/hotels/${id}`,
        method: 'POST', // Using POST with _method: 'PUT' in FormData
        data,
      }),
      invalidatesTags: (result, error, { id }) => ['VendorHotels', { type: 'VendorHotels', id }],
    }),
    createRoomTiers: builder.mutation<any, { hotelId: string | number; roomTiers: RoomTierPayload[] }>({
      query: ({ hotelId, roomTiers }) => ({
        url: `/hotels/${hotelId}/room-types`,
        method: 'POST',
        data: roomTiers,
      }),
      invalidatesTags: ['VendorHotels'],
    }),
    deleteHotel: builder.mutation<void, number>({
      query: (id) => ({
        url: `/vendor/hotels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['VendorHotels'],
    }),
  }),
});

export const { useGetHotelsQuery,
  useDeleteHotelMutation,
  useGetHotelByIdQuery,
  useCreateHotelBookingMutation,
  useLazyGetHotelAvailabilityQuery,
  useGetVendorHotelsQuery,
  useCreateHotelMutation,
  useCreateRoomTiersMutation,
  useGetVendorHotelByIdQuery,
  useUpdateHotelMutation } = hotelApi;