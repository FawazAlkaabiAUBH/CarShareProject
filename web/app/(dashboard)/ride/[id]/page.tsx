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
  Users,
  CheckCircle2
} from 'lucide-react';

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

interface User {
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

interface Booking {
  bookingId: number;
  rideId: number;
  userId: number;
  seatsBooked: number;
  bookingStatus: string;
}

export default function RideDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const rideId = params.id as string;
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverUser, setDriverUser] = useState<User | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [existingBooking, setExistingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchRideDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideId]);

  const fetchRideDetails = async () => {
    try {
      setLoading(true);
      const rideResponse = await apiClient.get(`/rides/${rideId}`);
      setRide(rideResponse.data);

      // Fetch driver details from drivers endpoint
      const driverResponse = await apiClient.get(`/drivers/user/${rideResponse.data.userId}`);
      setDriver(driverResponse.data);

      // Fetch driver user info from users endpoint
      const driverUserResponse = await apiClient.get(`/users/${rideResponse.data.userId}`);
      setDriverUser(driverUserResponse.data);

      // Fetch vehicle info
      const vehicleResponse = await apiClient.get(`/vehicles/${rideResponse.data.vehicleId}`);
      setVehicle(vehicleResponse.data);

      // Check if user already booked this ride
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        try {
          // Get bookings for this ride
          const bookingsResponse = await apiClient.get(`/bookings/ride/${rideId}`);
          const userBooking = bookingsResponse.data.find(
            (b: Booking) => b.userId === user.userId && b.bookingStatus !== 'CANCELLED'
          );
          
          if (userBooking) {
            setExistingBooking(userBooking);
          }
        } catch {
          console.log('No existing booking found');
        }
      }
    } catch (error) {
      console.error('Failed to fetch ride details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async () => {
    if (!ride) return;

    try {
      setBooking(true);
      
      // Get current user (rider)
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }
      
      const user = JSON.parse(userStr);

      const bookingData = {
        rideId: ride.rideId,
        seatsBooked: seatsToBook,
      };

      await apiClient.post('/bookings', bookingData);
      setShowSuccess(true);
      
      // Redirect to bookings after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to book ride:', error);
      alert('Failed to book ride. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#dc143c] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] flex items-center justify-center">
        <Card variant="glass">
          <div className="text-center py-8">
            <p className="text-white mb-4">Ride not found</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] flex items-center justify-center p-6">
        <Card variant="glass" className="max-w-md w-full">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Booking Successful!</h2>
            <p className="text-[#99a1af] mb-6">
              Your ride has been booked successfully. Redirecting to dashboard...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const totalFare = ride.farePerSeat * seatsToBook;
  const pickupDate = new Date(ride.departureTime);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-32">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <IconButton
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-medium text-white">Ride Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
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

        {/* Seats Selection */}
        <Card variant="glass">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#dc143c]" />
                <span className="text-white font-medium">Number of Seats</span>
              </div>
              <p className="text-[#99a1af] text-sm">{ride.availableSeats} available</p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSeatsToBook(Math.max(1, seatsToBook - 1))}
                disabled={seatsToBook <= 1}
              >
                -
              </Button>
              <span className="text-3xl font-bold text-white w-12 text-center">
                {seatsToBook}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSeatsToBook(Math.min(ride.availableSeats, seatsToBook + 1))}
                disabled={seatsToBook >= ride.availableSeats}
              >
                +
              </Button>
            </div>
          </div>
        </Card>

        {/* Price Breakdown */}
        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#99a1af]">Price per seat</span>
              <span className="text-white">{ride.farePerSeat.toFixed(2)} BD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#99a1af]">Seats booked</span>
              <span className="text-white">× {seatsToBook}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-white font-semibold text-lg">Total</span>
              <span className="text-[#dc143c] font-bold text-2xl">{totalFare.toFixed(2)} BD</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#101828] border-t-2 border-white/10 p-6">
        <div className="max-w-md mx-auto">
          {existingBooking ? (
            <div className="text-center">
              <p className="text-white mb-2">You already booked this ride</p>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => router.push(`/booking/${existingBooking.bookingId}`)}
              >
                View Booking
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleBookRide}
              disabled={booking || ride.availableSeats === 0}
            >
              {booking ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Booking...</span>
                </div>
              ) : (
                `Book Ride - ${totalFare.toFixed(2)} BD`
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
