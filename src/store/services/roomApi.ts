import { api } from './api';

export const roomApi = api.injectEndpoints({
  endpoints: (builder) => ({
    deleteRoomType: builder.mutation<{ status: string; message: string }, number>({
      query: (id) => ({
        url: `/room-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['VendorHotels'],
    }),
  }),
});

export const { useDeleteRoomTypeMutation } = roomApi;
