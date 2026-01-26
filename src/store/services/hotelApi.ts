import { api } from './api';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  description: string;
  images: string[];
}

export const hotelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET all hotels
    getHotels: builder.query<Hotel[], void>({
      query: () => ({
        url: '/hotels',
        method: 'GET',
      }),
      providesTags: ['Hotel'],
    }),
    
    // GET a single hotel
    getHotelById: builder.query<Hotel, string>({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),

    // POST (Add a new hotel - for Vendors)
    addHotel: builder.mutation<Hotel, Partial<Hotel>>({
      query: (newHotel) => ({
        url: '/hotels',
        method: 'POST',
        data: newHotel,
      }),
      invalidatesTags: ['Hotel'], // This auto-refetches the list after adding
    }),
  }),
});

// RTK Query auto-generates hooks based on the endpoint names
export const { 
  useGetHotelsQuery, 
  useGetHotelByIdQuery, 
  useAddHotelMutation 
} = hotelApi;