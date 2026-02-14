import { api } from './api';

export interface EventLocation {
  city: string;
  country: string;
  lat: number | string;
  lng: number | string;
  address?: string;
  full_address?: string;
  zip_code?: string | null;
}

export interface TicketBase {
  id: number;
  name: string;
  price: number;
  features: string[];
}

export interface PublicTicket extends TicketBase {
  available: number;
  soldOut: boolean;
  description?: string | null;
  popular?: boolean;
}

export interface BaseEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  highlights: string[];
  location_details: EventLocation;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  highlights: string[];
  location_details: EventLocation;
  date: string;
  time: string;
  is_past: boolean;
  image: string | null;
  gallery: string[];
  rating: number;
  attendees: string;
  ticketTypes: PublicTicket[];
  // Optional UI fields
  featured?: boolean;
  trending?: boolean;
  price?: string;
}

export interface VendorTicket extends TicketBase {
  quantity: number;
  sold_count: number;
  is_locked: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VendorImage {
  id: number;
  url: string;
  is_primary: number;
}

export interface VendorEvent extends BaseEvent {
  status: string;
  visibility: string;
  start_date: string;
  end_date: string;
  total_capacity: number;
  tickets_sold: number | string;
  revenue: number;
  gallery: VendorImage[];
  tickets: VendorTicket[];
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

export type EventTicketType = PublicTicket;

export type EventDetailsData = Event;

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