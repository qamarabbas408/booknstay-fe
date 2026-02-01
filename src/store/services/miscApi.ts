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

export interface EventCategory {
  id: number;
  name: string;
  slug: string;
  color_gradient: string;
  created_at: string;
  updated_at: string;
  events_count: number;
}

export interface EventCategoriesResponse {
  status: string;
  data: EventCategory[];
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
    getEventCategories: builder.query<EventCategoriesResponse, void>({
      query: () => ({
        url: '/event-categories',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetInterestsQuery, useGetAmenitiesQuery, useGetEventCategoriesQuery } = miscApi;