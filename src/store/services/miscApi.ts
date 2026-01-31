import { api } from './api';

export interface Interest {
  id: number;
  name: string;
  slug: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: number;
  name: string;
  slug: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export const miscApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInterests: builder.query<Interest[], void>({
      query: () => ({
        url: '/interests',
        method: 'GET',
      }),
    }),
    getAmenities: builder.query<Amenity[], void>({
      query: () => ({
        url: '/amenities',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetInterestsQuery, useGetAmenitiesQuery } = miscApi;