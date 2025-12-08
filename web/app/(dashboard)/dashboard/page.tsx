'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import NotificationBell from '@/components/NotificationBell';
import { apiClient } from '@/lib/api';
import { User, Search, PlusCircle, Calendar, Home, Car, Bell, Clock, Shield } from 'lucide-react';

interface User {
  userId: number;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface Booking {
  bookingId: number;
  rideId: number;
  userId: number;
  seatsBooked: number;
  totalFare?: number;
  totalAmount?: number;
  bookingStatus: string;
  createdAt: string;
}

interface Ride {
  rideId: number;
  origin: string;
  destination: string;
  departureTime: string;
  farePerSeat: number;
  availableSeats: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rides, setRides] = useState<{[key: number]: Ride}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchUserBookings(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchUserBookings = async (userData: User) => {
    try {
      setLoading(true);
      
      // Get bookings directly by userId
      const bookingsResponse = await apiClient.get(`/bookings/user/${userData.userId}`);
      const userBookings = bookingsResponse.data.filter(
        (b: Booking) => b.bookingStatus !== 'CANCELLED'
      );
      setBookings(userBookings);

      // Fetch ride details for each booking
      const ridePromises = userBookings.map((booking: Booking) =>
        apiClient.get(`/rides/${booking.rideId}`)
      );
      const rideResponses = await Promise.all(ridePromises);
      
      const ridesMap: {[key: number]: Ride} = {};
      rideResponses.forEach((response) => {
        ridesMap[response.data.rideId] = response.data;
      });
      setRides(ridesMap);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] p-6">
      {/* Header */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#99a1af] text-sm">Welcome back,</p>
            <h1 className="text-2xl font-medium text-white">{user.fullName || 'User'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <IconButton
              icon={<User className="w-6 h-6 text-slate-300" />}
              onClick={() => router.push('/profile')}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`grid ${user.role === 'ADMIN' ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-8`}>
          <Card
            variant="glass"
            className="cursor-pointer hover:bg-white/10"
            onClick={() => router.push('/find-ride')}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-b from-[#dc143c] to-[#8b0000] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-white font-medium">Find a Ride</p>
              <p className="text-sm text-[#99a1af] mt-1">Search available rides</p>
            </div>
          </Card>

          <Card
            variant="glass"
            className="cursor-pointer hover:bg-white/10"
            onClick={() => router.push('/offer-ride')}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-b from-[#002d72] to-[#dc143c] rounded-full flex items-center justify-center mb-4">
                <PlusCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-white font-medium">Offer a Ride</p>
              <p className="text-sm text-[#99a1af] mt-1">Share your journey</p>
            </div>
          </Card>

          {user.role === 'ADMIN' && (
            <Card
              variant="glass"
              className="cursor-pointer hover:bg-white/10"
              onClick={() => router.push('/admin/verify-drivers')}
            >
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-b from-[#10b981] to-[#059669] rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-white font-medium">Verify Drivers</p>
                <p className="text-sm text-[#99a1af] mt-1">Admin panel</p>
              </div>
            </Card>
          )}
        </div>

        {/* My Bookings */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-white mb-4">My Bookings</h2>
          {loading ? (
            <Card variant="default">
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-[#dc143c] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#99a1af]">Loading bookings...</p>
              </div>
            </Card>
          ) : bookings.length === 0 ? (
            <Card variant="default">
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-[#6a7282]" />
                <p className="text-[#99a1af]">No active bookings</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => router.push('/find-ride')}
                >
                  Find a Ride
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 3).map((booking) => {
                const ride = rides[booking.rideId];
                if (!ride) return null;
                
                const pickupDate = new Date(ride.departureTime);
                
                return (
                  <Card
                    key={booking.bookingId}
                    variant="glass"
                    className="cursor-pointer hover:bg-white/10"
                    onClick={() => router.push(`/booking/${booking.bookingId}`)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                          <p className="text-white font-medium text-sm truncate">{ride.origin}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-[#dc143c] rounded-full" />
                          <p className="text-white font-medium text-sm truncate">{ride.destination}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#99a1af]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {pickupDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pickupDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span>{booking.seatsBooked} seat{booking.seatsBooked > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#dc143c] font-bold">
                          {(booking.totalAmount || booking.totalFare || 0).toFixed(2)} BD
                        </p>
                        <span className="inline-block px-2 py-1 bg-[#10b981]/20 text-[#10b981] text-xs rounded-full mt-1">
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
              {bookings.length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/bookings')}
                >
                  View All Bookings
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="glass">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-sm text-[#99a1af]">Rides</p>
          </Card>
          <Card variant="glass">
            <p className="text-2xl font-bold text-white">0.0</p>
            <p className="text-sm text-[#99a1af]">Rating</p>
          </Card>
          <Card variant="glass">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-sm text-[#99a1af]">Saved</p>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#101828] border-t-2 border-white/10 p-4">
          <div className="max-w-md mx-auto flex justify-around">
            <button className="flex flex-col items-center gap-1">
              <Home className="w-6 h-6 text-[#dc143c]" />
              <span className="text-xs text-[#dc143c]">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1" onClick={() => router.push('/find-ride')}>
              <Car className="w-6 h-6 text-[#99a1af]" />
              <span className="text-xs text-[#99a1af]">Rides</span>
            </button>
            <button className="flex flex-col items-center gap-1" onClick={() => router.push('/notifications')}>
              <Bell className="w-6 h-6 text-[#99a1af]" />
              <span className="text-xs text-[#99a1af]">Alerts</span>
            </button>
            <button className="flex flex-col items-center gap-1" onClick={() => router.push('/profile')}>
              <User className="w-6 h-6 text-[#99a1af]" />
              <span className="text-xs text-[#99a1af]">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
