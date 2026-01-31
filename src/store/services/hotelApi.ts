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
}

export const hotelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query<HotelsResponse, HotelQueryParams>({
      query: (params) => {
        const { amenities, ...rest } = params;
        const queryParams: Record<string, any> = { ...rest };
        if (amenities && amenities.length > 0) {
          queryParams['amenities[]'] = amenities;
        }
        return {
          url: '/hotels',
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  }),
});

export const { useGetHotelsQuery } = hotelApi;