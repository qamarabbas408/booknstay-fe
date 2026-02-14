import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Building2, Award, Users, ArrowUp, ArrowDown, Minus, Loader2, Clock, CheckCircle } from 'lucide-react';
import { useGetVendorAnalyticsQuery } from '../../store/services/analyticsApi';
import PulseLoader from '../PulseLoader';

const VendorAnalyticsDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'hotels' | 'rooms' | 'events'>('hotels');
  const { data: analyticsResponse, isLoading } = useGetVendorAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <PulseLoader  containerStyle="animate-spin text-indigo-600"  />
      </div>
    );
  }

  const analyticsData = analyticsResponse?.data;

  if (!analyticsData) return null;

  const maxRevenue = Math.max(...(analyticsData.charts.revenue_by_month?.map(m => m.revenue) || [0]));

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp size={16} className="text-green-600" />;
    if (growth < 0) return <ArrowDown size={16} className="text-red-600" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-slate-500';
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
   
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-3">
            Welcome back, Qamar
          </h1>
          <p className="text-lg text-slate-600">
           Here's what's happening with your hotel today
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          
          {/* Net Earnings */}
          <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 animate-fadeInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <DollarSign size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Net Earnings
                </div>
              </div>
            </div>
            <div className="text-3xl font-display text-slate-900 mb-1">
              ${analyticsData.summary.net_earnings.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600">
              After platform fees
            </div>
          </div>

          {/* Platform Fees */}
          <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Platform Fees
                </div>
              </div>
            </div>
            <div className="text-3xl font-display text-slate-900 mb-1">
              ${analyticsData.summary.platform_fees.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600">
              Commission & fees
            </div>
          </div>

          {/* Total Bookings */}
          <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Calendar size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Bookings
                </div>
              </div>
            </div>
            <div className="text-3xl font-display text-slate-900 mb-1">
              {analyticsData.summary.total_bookings}
            </div>
            <div className="text-xs text-slate-600">
              All time bookings
            </div>
          </div>

          {/* Active Listings */}
          <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Listings
                </div>
              </div>
            </div>
            <div className="text-3xl font-display text-slate-900 mb-1">
              {analyticsData.summary.active_listings}
            </div>
            <div className="text-xs text-slate-600">
              Properties & events
            </div>
          </div>
        </div>

        {/* Performance Cards (Revenue, Bookings, Occupancy) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          
          {/* Revenue Card */}
          <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-slate-600 mb-2">
                  {analyticsData.cards.revenue.label}
                </div>
                <div className="text-3xl font-display gradient-text">
                  ${analyticsData.cards.revenue.value.toLocaleString()}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                analyticsData.cards.revenue.growth >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {getGrowthIcon(analyticsData.cards.revenue.growth)}
                <span className={`text-xs font-bold ${getGrowthColor(analyticsData.cards.revenue.growth)}`}>
                  {Math.abs(analyticsData.cards.revenue.growth)}%
                </span>
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-slate-600 mb-2">
                  {analyticsData.cards.bookings.label}
                </div>
                <div className="text-3xl font-display gradient-text">
                  {analyticsData.cards.bookings.value}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                analyticsData.cards.bookings.growth >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {getGrowthIcon(analyticsData.cards.bookings.growth)}
                <span className={`text-xs font-bold ${getGrowthColor(analyticsData.cards.bookings.growth)}`}>
                  {Math.abs(analyticsData.cards.bookings.growth)}%
                </span>
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </div>

          {/* Occupancy Card */}
          <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-slate-600 mb-2">
                  {analyticsData.cards.occupancy.label}
                </div>
                <div className="text-3xl font-display gradient-text">
                  {analyticsData.cards.occupancy.value}%
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                analyticsData.cards.occupancy.growth >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {getGrowthIcon(analyticsData.cards.occupancy.growth)}
                <span className={`text-xs font-bold ${getGrowthColor(analyticsData.cards.occupancy.growth)}`}>
                  {Math.abs(analyticsData.cards.occupancy.growth)}%
                </span>
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="glass rounded-2xl p-6 md:p-8 shadow-lg border border-white/40 mb-8 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
          <h2 className="text-2xl font-display text-slate-900 mb-6">Revenue by Month</h2>
          
          <div className="flex items-end justify-between h-64 space-x-2">
            {analyticsData.charts.revenue_by_month.map((month, index) => {
              const heightPercentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={month.name} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex-1 flex items-end justify-center mb-2 relative group">
                    {/* Tooltip */}
                    {month.revenue > 0 && (
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none">
                        ${month.revenue.toLocaleString()}
                      </div>
                    )}
                    
                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer animate-slideUp ${
                        month.revenue > 0
                          ? 'bg-gradient-to-t from-indigo-600 to-purple-600'
                          : 'bg-slate-200'
                      }`}
                      style={{ 
                        height: `${heightPercentage}%`,
                        minHeight: month.revenue > 0 ? '8px' : '4px',
                        animationDelay: `${index * 0.05}s`
                      }}
                    ></div>
                  </div>
                  
                  {/* Month Label */}
                  <div className="text-xs font-semibold text-slate-600 mt-2">
                    {month.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Section */}
        <div className="glass rounded-2xl p-6 md:p-8 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display text-slate-900">Top Performers</h2>
            
            {/* Tab Switcher */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setSelectedTab('hotels')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedTab === 'hotels'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hotels
              </button>
              <button
                onClick={() => setSelectedTab('rooms')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedTab === 'rooms'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rooms
              </button>
              <button
                onClick={() => setSelectedTab('events')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedTab === 'events'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Events
              </button>
            </div>
          </div>

          {/* Top Performer Badge */}
          {selectedTab === 'hotels' && analyticsData.performance.hotels.list.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                  <Award size={24} className="text-blue-900" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-900">Top Performing Hotel</div>
                  <div className="text-lg font-bold text-blue-700">
                    {analyticsData.performance.hotels.top_hotel}
                  </div>
                  <div className="text-sm text-blue-600">
                    ${analyticsData.performance.hotels.top_revenue.toLocaleString()} in revenue
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Performer Badge */}
          {selectedTab === 'rooms' && analyticsData.performance.rooms.data.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                  <Award size={24} className="text-amber-900" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-900">Top Performing Room</div>
                  <div className="text-lg font-bold text-amber-700">
                    {analyticsData.performance.rooms.top_performer}
                  </div>
                  <div className="text-sm text-amber-600">
                    ${analyticsData.performance.rooms.top_revenue.toLocaleString()} in revenue
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'events' && analyticsData.performance.events.data.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                  <Award size={24} className="text-purple-900" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-purple-900">Top Performing Event</div>
                  <div className="text-lg font-bold text-purple-700">
                    {analyticsData.performance.events.top_performer}
                  </div>
                  <div className="text-sm text-purple-600">
                    ${analyticsData.performance.events.top_revenue.toLocaleString()} in revenue
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-bold text-slate-900">
                    {selectedTab === 'hotels' ? 'Hotel Name' : selectedTab === 'rooms' ? 'Room Type' : 'Event Tier'}
                  </th>
                  <th className="text-right py-3 px-4 font-bold text-slate-900">
                    {selectedTab === 'hotels' ? 'Bookings' : selectedTab === 'rooms' ? 'Bookings' : 'Tickets'}
                  </th>
                  <th className="text-right py-3 px-4 font-bold text-slate-900">Revenue</th>
                  <th className="text-right py-3 px-4 font-bold text-slate-900">
                    {selectedTab === 'hotels' ? 'Occupancy' : 'Avg. Value'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedTab === 'hotels' && analyticsData.performance.hotels.list.map((item, index) => {
                  return (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-4 px-4 text-right text-slate-700">{item.bookings_count}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-green-600">${item.revenue.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-600">
                        {item.occupancy}%
                      </td>
                    </tr>
                  );
                })}

                {selectedTab === 'rooms' && analyticsData.performance.rooms.data.map((item, index) => {
                  const avgValue = item.bookings ? (item.revenue / item.bookings) : 0;
                  return (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-900">{item.label}</td>
                      <td className="py-4 px-4 text-right text-slate-700">{item.bookings}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-green-600">${item.revenue.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-600">
                        ${avgValue.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}

                {selectedTab === 'events' && analyticsData.performance.events.data.map((item, index) => {
                  const avgValue = item.tickets ? (item.revenue / item.tickets) : 0;
                  return (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-900">{item.label}</td>
                      <td className="py-4 px-4 text-right text-slate-700">{item.tickets}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-green-600">${item.revenue.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-600">
                        ${avgValue.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {((selectedTab === 'rooms' && analyticsData.performance.rooms.data.length === 0) ||
            (selectedTab === 'events' && analyticsData.performance.events.data.length === 0) ||
            (selectedTab === 'hotels' && analyticsData.performance.hotels.list.length === 0)) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Data Available</h3>
              <p className="text-slate-600">
                {selectedTab === 'rooms' 
                  ? 'No room bookings recorded yet' 
                  : selectedTab === 'events' ? 'No event tickets sold yet' : 'No hotel data available'}
              </p>
            </div>
          )}
        </div>

        {/* Recent Bookings Section */}
        <div className="glass rounded-2xl p-6 md:p-8 shadow-lg border border-white/40 animate-fadeInUp my-10" style={{animationDelay: '0.9s'}}>
           <h2 className="text-2xl font-display text-slate-900 mb-6">Recent Bookings</h2>
           
           {analyticsData.recent_bookings && analyticsData.recent_bookings.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b-2 border-slate-200">
                     <th className="text-left py-3 px-4 font-bold text-slate-900">Booking Code</th>
                     <th className="text-left py-3 px-4 font-bold text-slate-900">Guest</th>
                     <th className="text-left py-3 px-4 font-bold text-slate-900">Item</th>
                     <th className="text-left py-3 px-4 font-bold text-slate-900">Date</th>
                     <th className="text-right py-3 px-4 font-bold text-slate-900">Amount</th>
                     <th className="text-center py-3 px-4 font-bold text-slate-900">Status</th>
                     <th className="text-center py-3 px-4 font-bold text-slate-900">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {analyticsData.recent_bookings.map((booking) => (
                     <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                       <td className="py-4 px-4 font-mono text-sm text-slate-600">{booking.booking_code}</td>
                       <td className="py-4 px-4">
                         <div className="font-semibold text-slate-900">{booking.guest.name}</div>
                         <div className="text-xs text-slate-500">{booking.guest.email}</div>
                       </td>
                       <td className="py-4 px-4">
                         <div className="font-medium text-slate-900">{booking.target.title}</div>
                         <div className="text-xs text-slate-500 flex items-center">
                           <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${booking.target.type === 'Hotel' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                           {booking.target.sub_title}
                         </div>
                       </td>
                       <td className="py-4 px-4 text-sm text-slate-600">
                         <div className="flex items-center">
                           <Clock size={14} className="mr-1.5 text-slate-400" />
                           {booking.timing.event_date || booking.timing.check_in}
                         </div>
                       </td>
                       <td className="py-4 px-4 text-right font-bold text-slate-900">
                         ${booking.financials.total_price.toLocaleString()}
                       </td>
                       <td className="py-4 px-4 text-center">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                           booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                         }`}>
                           {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                         </span>
                       </td>
                       <td className="py-4 px-4 text-center">
                         <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">
                           View
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           ) : (
             <div className="text-center py-12 text-slate-500">
               No recent bookings found.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VendorAnalyticsDashboard;