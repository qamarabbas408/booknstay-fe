import { api } from './api';

export interface AnalyticsSummary {
  net_earnings: number;
  platform_fees: number;
  total_bookings: number;
  active_listings: number;
}

export interface AnalyticsCard {
  value: number;
  growth: number;
  label: string;
}

export interface AnalyticsCards {
  revenue: AnalyticsCard;
  bookings: AnalyticsCard;
  occupancy: AnalyticsCard;
}

export interface MonthlyRevenue {
  name: string;
  revenue: number;
}

export interface PerformanceItem {
  label: string;
  bookings?: number;
  tickets?: number;
  revenue: number;
}

export interface PerformanceSection {
  data: PerformanceItem[];
  top_performer: string;
  top_revenue: number;
}

export interface HotelPerformanceItem {
  id: number;
  name: string;
  bookings_count: number;
  revenue: number;
  occupancy: number;
}

export interface HotelPerformanceSection {
  list: HotelPerformanceItem[];
  top_hotel: string;
  top_revenue: number;
}

export interface RecentBooking {
  id: number;
  booking_code: string;
  status: string;
  created_at: string;
  target: {
    type: string;
    title: string;
    sub_title: string;
  };
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  timing: {
    event_date?: string;
    check_in?: string;
    check_out?: string;
    nights?: number;
  };
  financials: {
    total_price: number;
  };
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  cards: AnalyticsCards;
  charts: {
    revenue_by_month: MonthlyRevenue[];
  };
  performance: {
    hotels: HotelPerformanceSection;
    rooms: PerformanceSection;
    events: PerformanceSection;
  };
  recent_bookings: RecentBooking[];
}

export interface AnalyticsResponse {
  status: string;
  message: string;
  data: AnalyticsData;
}

export interface VendorBookingsQueryParams {
  page?: number;
  search?: string;
  status?: string;
  date_filter?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
}

export interface VendorBookingsResponse {
  status: string;
  data: RecentBooking[];
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendorAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => ({
        url: '/vendor/analytics',
        method: 'GET',
      }),
    }),
    getVendorBookings: builder.query<VendorBookingsResponse, VendorBookingsQueryParams>({
      query: (params) => ({
        url: '/vendor/bookings',
        method: 'GET',
        params,
      }),
      providesTags: ['VendorBookings'],
    }),
    updateVendorBookingStatus: builder.mutation<any, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/vendor/booking/${id}/status`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: ['VendorBookings'],
    }),
  }),
});

export const { 
  useGetVendorAnalyticsQuery,
  useGetVendorBookingsQuery,
  useUpdateVendorBookingStatusMutation
} = vendorApi;