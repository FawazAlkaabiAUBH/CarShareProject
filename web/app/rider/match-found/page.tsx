'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { CheckCircle2, Phone, MessageCircle, MapPin, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function MatchFoundContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams?.get('rideId');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [rideData, setRideData] = useState<any>(null);

  useEffect(() => {
    const fetchRideData = async () => {
      if (!rideId) {
        router.push('/rider/available-drivers');
        return;
      }

      try {
        const { ridesApi } = await import('@/lib/api');
        const ride = await ridesApi.getRideById(parseInt(rideId));
        setRideData(ride);
      } catch (error) {
        console.error('Failed to fetch ride data:', error);
        alert('Failed to load ride information');
        router.push('/rider/available-drivers');
      } finally {
        setFetchingData(false);
      }
    };

    fetchRideData();
  }, [rideId, router]);

  const handleConfirmBooking = async () => {
    setLoading(true);
    
    try {
      const { bookingsApi } = await import('@/lib/api');
      const paymentMethod = searchParams?.get('paymentMethod') as 'CASH' | 'BENEFITPAY' || 'CASH';
      const seatsBooked = parseInt(searchParams?.get('seats') || '1');
      
      if (!rideId) {
        throw new Error('Ride ID is required');
      }

      // Create booking
      const booking = await bookingsApi.createBooking({
        rideId: parseInt(rideId),
        seatsBooked,
        paymentMethod,
        benefitPayPhone: paymentMethod === 'BENEFITPAY' 
          ? localStorage.getItem('benefitPayPhone') || undefined 
          : undefined,
      });

      // Navigate to ride in progress with booking info
      router.push(`/rider/ride-in-progress?bookingId=${booking.bookingId}&rideId=${rideId}`);
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking. Please try again.');
      setLoading(false);
    }
  };

  const handleDecline = () => {
    router.push('/rider/available-drivers');
  };

  if (fetchingData || !rideData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#DC143C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const driverName = rideData.driver?.name || 'Driver';
  const driverRating = rideData.driver?.rating || 5.0;
  const driverRides = rideData.driver?.totalRides || 0;
  const carInfo = rideData.car ? `${rideData.car.make} ${rideData.car.model}` : 'Vehicle';
  const carColor = rideData.car?.color || 'N/A';
  const carPlate = rideData.car?.licensePlate || 'N/A';
  const farePerSeat = rideData.farePerSeat || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-white">Driver Found!</h1>
          <button
            onClick={handleDecline}
            className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center"
          >
            <X className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
          </button>
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-[108px] h-[108px] bg-gradient-to-b from-green-600 to-green-800 rounded-[27px] shadow-2xl flex items-center justify-center">
            <CheckCircle2 className="w-[72px] h-[72px] text-white" strokeWidth={2} />
          </div>
        </div>

        <p className="text-center text-[#99A1AF] mb-6">
          We found a driver for your trip
        </p>
      </div>

      {/* Driver Info Card */}
      <div className="mx-6 mb-6 p-6 bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[18px]">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {driverName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-1">{driverName}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm">{driverRating.toFixed(1)}</span>
              </div>
              <span className="text-[#99A1AF] text-sm">
                {driverRides} rides
              </span>
            </div>
          </div>
        </div>

        {/* Car Info */}
        <div className="p-4 bg-white/5 rounded-[12px] mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#99A1AF] text-sm">Vehicle</span>
            <span className="text-white font-medium">{carInfo}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#99A1AF] text-sm">Color</span>
            <span className="text-white">{carColor}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#99A1AF] text-sm">Plate</span>
            <span className="text-white font-mono">{carPlate}</span>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#DC143C] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">Pickup</p>
              <p className="text-sm text-white">{rideData.origin}</p>
            </div>
            <span className="text-xs text-[#99A1AF]">
              {new Date(rideData.departureTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">Destination</p>
              <p className="text-sm text-white">{rideData.destination}</p>
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center gap-2 text-white">
            <Phone className="w-5 h-5" />
            Call
          </button>
          <button 
            onClick={() => router.push('/chat')}
            className="flex-1 h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center gap-2 text-white"
          >
            <MessageCircle className="w-5 h-5" />
            Chat
          </button>
        </div>
      </div>

      {/* Fare Display */}
      <div className="mx-6 mb-6 p-4 bg-gradient-to-r from-[#DC143C]/20 to-[#8B0000]/20 border border-[#DC143C]/30 rounded-[18px]">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">Trip Fare (per seat)</span>
          <span className="text-2xl font-bold text-white">
            BHD {farePerSeat.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-6 space-y-3">
        <Button
          onClick={handleConfirmBooking}
          disabled={loading}
          className="w-full h-[63px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] text-white rounded-[18px] font-medium disabled:opacity-50"
        >
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </Button>
        <button
          onClick={handleDecline}
          className="w-full h-[63px] bg-[#1E2939] border-2 border-[#364153] text-white rounded-[18px]"
        >
          Find Another Driver
        </button>
      </div>
    </div>
  );
}

export default function MatchFoundPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]" />}>
      <MatchFoundContent />
    </Suspense>
  );
}
