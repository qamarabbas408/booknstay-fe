import { api } from './api';

export interface Event {
  id: number;
  title: string;
  category: string;
  location: string;
  venue: string;
  price: string;
  start_date: string;
  end_date: string;
  image: string;
  rating: number;
  attendees: number;
  featured: boolean;
  trending: boolean;
  is_sold_out: boolean;
  total_capacity: number;
  tickets_left: number | null;
}

export interface VendorEvent {
  id: number;
  title: string;
  status: string;
  visibility: string;
  description?: string;
  venue?: string;
  location?: string;
  start_date: string;
  end_date: string;
  total_capacity: number;
  tickets_sold: number;
  revenue: number;
  category: string;
  highlights?: string[];
  tickets: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    sold_count: number;
    created_at: string;
    updated_at: string;
    is_locked?: boolean;
    features?: string[];
  }[];
  images: { id: number; url: string; is_primary: number }[];
}

export interface EventsResponse {
  status: string;
  data: Event[];
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface EventQueryParams {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  trending?: boolean;
  date_filter?: string;
  sort_by?: string;
  page?: number;
  limit?: number;
}

export interface EventTicketType {
  id: number;
  name: string;
  price: number;
  available: number;
  soldOut: boolean;
  description: string | null;
  features: string[];
  popular: boolean;
}

export interface EventDetailsData {
  id: number;
  title: string;
  location: string;
  venue: string;
  date: string;
  time: string;
  image: string | null;
  description: string;
  highlights: string[];
  rating: number;
  attendees: string;
  ticketTypes: EventTicketType[];
}

export interface EventDetailsResponse {
  status: string;
  message: string | null;
  data: EventDetailsData;
}

export const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, EventQueryParams>({
      query: (params) => ({
        url: '/events',
        method: 'GET',
        params,
      }),
    }),
    createEvent: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/vendor/event', //create event
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['VendorEvents'],
    }),
    getVendorEvents: builder.query<{ data: VendorEvent[] }, void>({
      query: () => ({
        url: '/vendor/events', //fetch vendor events 
        method: 'GET',
      }),
      providesTags: ['VendorEvents'],
    }),
    getVendorEvent : builder.query<{ data: VendorEvent }, number>({
      query: (id) => ({
        url: `/vendor/event/${id}`, //fetch vendor event by id
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'VendorEvent', id }],
    }),
    updateVendorEvent : builder.mutation<any, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/vendor/event/edit/${id}`, //update vendor event
        method: 'POST',
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['VendorEvents', { type: 'VendorEvent', id }],
    }),
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/vendor/event/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['VendorEvents'],
    }),
    getEventById: builder.query<EventDetailsResponse, number>({
      query: (id) => ({
        url: `/event/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    createEventBooking: builder.mutation<any, { event_id: number; selections: { ticket_id: number; quantity: number }[] }>({
      query: (data) => ({
        url: '/guest/event/booking',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useGetVendorEventsQuery,
  useGetVendorEventQuery,
  useUpdateVendorEventMutation,
  useDeleteEventMutation,
  useGetEventByIdQuery,
  useCreateEventBookingMutation,
} = eventApi;