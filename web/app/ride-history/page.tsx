'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, DollarSign, Loader2, Car } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function RideHistoryPage() {
  const router = useRouter();
  const { user, currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isDriver = currentRole === 'DRIVER';
  const [stats, setStats] = useState({
    totalRides: 0,
    thisMonth: 0,
    totalSpent: '0.00',
  });

  useEffect(() => {
    const fetchRideHistory = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        // Use the current role from context
        const isDriverMode = currentRole === 'DRIVER';

        if (isDriverMode) {
          // Fetch driver's posted rides
          const { ridesApi } = await import('@/lib/api');
          const driverRides = await ridesApi.getRidesByDriver(user.userId);

          // Calculate stats for driver
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          
          const thisMonthRides = driverRides.filter(
            (ride: any) => new Date(ride.createdAt) > oneMonthAgo
          );

          const totalEarnings = driverRides
            .filter((ride: any) => ride.rideStatus === 'COMPLETED')
            .reduce((sum: number, ride: any) => sum + (ride.driverEarnings || 0), 0);

          setStats({
            totalRides: driverRides.length,
            thisMonth: thisMonthRides.length,
            totalSpent: totalEarnings.toFixed(2),
          });

          // Format driver rides for display
          const formattedRides = driverRides.map((ride: any) => ({
            id: ride.rideId,
            from: ride.origin,
            to: ride.destination,
            date: new Date(ride.departureTime).toISOString().split('T')[0],
            time: new Date(ride.departureTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            otherPerson: `${ride.availableSeats}/${ride.totalSeats} seats`,
            price: `BHD ${(ride.driverEarnings || 0).toFixed(2)}`,
            status: ride.rideStatus,
            departureTime: ride.departureTime,
          }));

          setRides(formattedRides);
        } else {
          // Fetch rider's bookings
          const { bookingsApi } = await import('@/lib/api');
          const myBookings = await bookingsApi.getMyBookings();

          // Calculate stats for rider
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          
          const thisMonthBookings = myBookings.filter(
            (b: any) => new Date(b.createdAt) > oneMonthAgo
          );

          const totalSpent = myBookings
            .filter((b: any) => b.bookingStatus === 'COMPLETED')
            .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

          setStats({
            totalRides: myBookings.length,
            thisMonth: thisMonthBookings.length,
            totalSpent: totalSpent.toFixed(2),
          });

          // Format rider bookings for display
          const formattedRides = myBookings.map((booking: any) => ({
            id: booking.bookingId,
            from: booking.ride?.origin || 'Unknown',
            to: booking.ride?.destination || 'Unknown',
            date: new Date(booking.createdAt).toISOString().split('T')[0],
            time: new Date(booking.ride?.departureTime || booking.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            otherPerson: booking.ride?.driver?.name || 'Driver',
            price: `BHD ${(booking.totalAmount || 0).toFixed(2)}`,
            status: booking.bookingStatus,
            departureTime: booking.ride?.departureTime,
          }));

          setRides(formattedRides);
        }
      } catch (error) {
        console.error('Failed to fetch ride history:', error);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, [user?.userId]);

  // Filter rides based on tab
  const filteredRides = rides.filter(ride => {
    if (activeTab === 'upcoming') {
      // Show upcoming rides (not completed/cancelled and departure time in future)
      if (isDriver) {
        return ['AVAILABLE', 'OPEN', 'BOOKED', 'IN_PROGRESS'].includes(ride.status);
      } else {
        return ['PENDING', 'CONFIRMED'].includes(ride.status);
      }
    } else {
      // Show completed rides
      return ride.status === 'COMPLETED';
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <button
          onClick={() => router.back()}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>

        <h1 className="text-2xl font-medium text-white mb-6">
          {isDriver ? 'Posted Rides' : 'My Rides'}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px]">
            <div className="text-2xl font-bold text-white mb-1">{stats.totalRides}</div>
            <div className="text-xs text-[#99A1AF]">Total {isDriver ? 'Rides' : 'Bookings'}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px]">
            <div className="text-2xl font-bold text-white mb-1">{stats.thisMonth}</div>
            <div className="text-xs text-[#99A1AF]">This Month</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px]">
            <div className="text-lg font-bold text-white mb-1">BHD {stats.totalSpent}</div>
            <div className="text-xs text-[#99A1AF]">{isDriver ? 'Earned' : 'Spent'}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 h-[48px] rounded-[18px] font-medium transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[#DC143C] text-white'
                : 'bg-[#1E2939] border-2 border-[#364153] text-[#D1D5DC]'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 h-[48px] rounded-[18px] font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-[#DC143C] text-white'
                : 'bg-[#1E2939] border-2 border-[#364153] text-[#D1D5DC]'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Ride List */}
      <div className="px-6 pb-8 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#DC143C] animate-spin" />
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-[#6A7282] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No {activeTab} {isDriver ? 'rides' : 'bookings'}
            </h3>
            <p className="text-[#99A1AF]">
              {activeTab === 'upcoming' 
                ? isDriver 
                  ? 'Post a ride to get started'
                  : 'Book a ride to get started'
                : isDriver
                  ? 'Your completed rides will appear here'
                  : 'Your completed bookings will appear here'}
            </p>
          </div>
        ) : (
          filteredRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#DC143C]" />
                    <span className="text-white font-medium">{ride.from}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">{ride.to}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#99A1AF]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{ride.date}</span>
                    </div>
                    <span>{ride.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-white font-semibold mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{ride.price}</span>
                  </div>
                  <span className="text-sm text-[#99A1AF]">{ride.otherPerson}</span>
                </div>
              </div>
              <button className="w-full py-2 bg-white/5 rounded-lg text-sm text-[#DC143C] hover:bg-white/10 transition-colors">
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
