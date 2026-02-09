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
    getRoomTypeById: builder.query<{ data: any }, string | number>({
      query: (id) => ({
        url: `vendor/room-types/${id}`,
        method: 'GET',
      }),
    }),
    updateRoomType: builder.mutation<any, { id: string | number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/room-types/${id}`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['VendorHotels'],
    }),
  }),
});

export const { useDeleteRoomTypeMutation, useGetRoomTypeByIdQuery, useUpdateRoomTypeMutation } = roomApi;
