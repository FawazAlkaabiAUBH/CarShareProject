'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';
import { 
  ChevronLeft, 
  Clock, 
  User, 
  Car, 
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Booking {
  bookingId: number;
  rideId: number;
  userId: number;
  seatsBooked: number;
  totalFare: number;
  bookingStatus: string;
  createdAt: string;
}

interface Ride {
  rideId: number;
  userId: number;
  origin: string;
  destination: string;
  departureTime: string;
  farePerSeat: number;
  availableSeats: number;
  rideStatus: string;
}

interface Driver {
  userId: number;
  licenseNumber: string;
  rating: number;
  totalRides: number;
  isVerified: boolean;
}

interface UserInfo {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface Vehicle {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [ride, setRide] = useState<Ride | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverUser, setDriverUser] = useState<UserInfo | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch booking
      const bookingResponse = await apiClient.get(`/bookings/${bookingId}`);
      setBooking(bookingResponse.data);

      // Fetch ride
      const rideResponse = await apiClient.get(`/rides/${bookingResponse.data.rideId}`);
      setRide(rideResponse.data);

      // Fetch driver from drivers endpoint
      const driverResponse = await apiClient.get(`/drivers/user/${rideResponse.data.userId}`);
      setDriver(driverResponse.data);

      // Fetch driver user info from users endpoint
      const driverUserResponse = await apiClient.get(`/users/${rideResponse.data.userId}`);
      setDriverUser(driverUserResponse.data);

      // Fetch vehicle info
      const vehicleResponse = await apiClient.get(`/vehicles/${rideResponse.data.vehicleId}`);
      setVehicle(vehicleResponse.data);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      setCancelling(true);
      await apiClient.post(`/bookings/${booking.bookingId}/cancel`, {
        reason: 'Cancelled by user'
      });
      
      // Refresh booking details
      await fetchBookingDetails();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#dc143c] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking || !ride) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] flex items-center justify-center">
        <Card variant="glass">
          <div className="text-center py-8">
            <p className="text-white mb-4">Booking not found</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  const pickupDate = new Date(ride.departureTime);
  const bookingDate = new Date(booking.createdAt);

  const getStatusIcon = () => {
    switch (booking.bookingStatus) {
      case 'CONFIRMED':
        return <CheckCircle2 className="w-6 h-6 text-[#10b981]" />;
      case 'CANCELLED':
        return <XCircle className="w-6 h-6 text-[#dc143c]" />;
      case 'PENDING':
        return <AlertCircle className="w-6 h-6 text-[#fbbf24]" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-[#10b981]" />;
    }
  };

  const getStatusColor = () => {
    switch (booking.bookingStatus) {
      case 'CONFIRMED':
        return 'bg-[#10b981]/20 text-[#10b981]';
      case 'CANCELLED':
        return 'bg-[#dc143c]/20 text-[#dc143c]';
      case 'PENDING':
        return 'bg-[#fbbf24]/20 text-[#fbbf24]';
      default:
        return 'bg-[#10b981]/20 text-[#10b981]';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-32">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <IconButton
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-medium text-white">Booking Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Booking Status */}
        <Card variant="glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <p className="text-white font-semibold">Booking #{booking.bookingId}</p>
                <p className="text-[#99a1af] text-sm">
                  Booked on {bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {booking.bookingStatus}
            </span>
          </div>
        </Card>

        {/* Route Card */}
        <Card variant="default" className="bg-gradient-to-br from-[#dc143c] to-[#8b0000]">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-white rounded-full mt-1.5" />
              <div className="flex-1">
                <p className="text-white/60 text-sm mb-1">Pickup</p>
                <p className="text-white font-semibold text-lg">{ride.origin}</p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-white/30 ml-1.5 h-8" />

            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-white rounded-full mt-1.5" />
              <div className="flex-1">
                <p className="text-white/60 text-sm mb-1">Dropoff</p>
                <p className="text-white font-semibold text-lg">{ride.destination}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="glass">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#dc143c]/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#dc143c]" />
              </div>
              <div>
                <p className="text-[#99a1af] text-sm">Date</p>
                <p className="text-white font-semibold">
                  {pickupDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="glass">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#dc143c]/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#dc143c]" />
              </div>
              <div>
                <p className="text-[#99a1af] text-sm">Time</p>
                <p className="text-white font-semibold">
                  {pickupDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Driver Info */}
        {driver && driverUser && (
          <Card variant="glass">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-b from-[#dc143c] to-[#8b0000] rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold">{driverUser.fullName}</p>
                  {driver.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  )}
                </div>
                <p className="text-[#99a1af] text-sm">{driverUser.phoneNumber}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[#fbbf24]">★</span>
                  <span className="text-white text-sm font-medium">{driver.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-[#99a1af] text-sm ml-1">• {driver.totalRides} rides</span>
                </div>
              </div>
              <Car className="w-6 h-6 text-[#99a1af]" />
            </div>
            {vehicle && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[#99a1af] text-sm mb-1">Vehicle</p>
                <p className="text-white font-medium">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                <p className="text-[#99a1af] text-sm mt-1">{vehicle.color} • {vehicle.plateNumber}</p>
              </div>
            )}
          </Card>
        )}

        {/* Booking Details */}
        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#99a1af]">Price per seat</span>
              <span className="text-white">{ride.farePerSeat.toFixed(2)} BD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#99a1af]">Seats booked</span>
              <span className="text-white">× {booking.seatsBooked}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-white font-semibold text-lg">Total Paid</span>
              <span className="text-[#dc143c] font-bold text-2xl">{booking.totalFare.toFixed(2)} BD</span>
            </div>
          </div>
        </Card>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
            <Card variant="solid" className="max-w-sm w-full bg-[#1a1d29]">
              <div className="text-center py-4">
                <XCircle className="w-16 h-16 mx-auto mb-4 text-[#dc143c]" />
                <h3 className="text-xl font-bold text-white mb-2">Cancel Booking?</h3>
                <p className="text-[#99a1af] mb-6">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={cancelling}
                  >
                    Keep Booking
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1 bg-[#dc143c]"
                    onClick={handleCancelBooking}
                    disabled={cancelling}
                  >
                    {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      {booking.bookingStatus !== 'CANCELLED' && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#101828] border-t-2 border-white/10 p-6">
          <div className="max-w-md mx-auto flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => router.push(`/ride/${ride.rideId}`)}
            >
              View Ride
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 bg-[#dc143c]"
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
