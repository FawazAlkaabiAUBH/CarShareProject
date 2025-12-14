'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { MapPin, Phone, MessageCircle, Shield, Navigation, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SafetyCodeDisplay } from '@/components/SafetyCodeDisplay';

function RideInProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const driverId = searchParams?.get('driverId');
  
  const [rideStatus, setRideStatus] = useState<'waiting' | 'started' | 'arrived'>('waiting');
  const [safetyCode] = useState('4231');

  const driverInfo = {
    name: 'Fawaz Alkaabi',
    phone: '+973-9876-5432',
    rating: 4.9,
    car: 'Toyota Camry',
    plate: '12345',
    origin: 'AUBH Campus',
    destination: 'City Centre Mall',
    eta: '5 min',
  };

  const handleArrived = async () => {
    const bookingId = searchParams?.get('bookingId');
    const rideId = searchParams?.get('rideId');
    
    if (!bookingId) {
      router.push('/dashboard/rider');
      return;
    }

    try {
      const { bookingsApi } = await import('@/lib/api');
      const booking = await bookingsApi.getBookingById(parseInt(bookingId));
      
      // Navigate to payment with booking details
      router.push(`/payment-method?amount=${booking.totalAmount}&rideId=${rideId}&bookingId=${bookingId}`);
    } catch (error) {
      console.error('Failed to get booking details:', error);
      alert('Failed to proceed to payment. Please try again.');
    }
  };

  const handleEmergency = () => {
    router.push('/safety');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <h1 className="text-2xl font-medium text-white mb-2">
          {rideStatus === 'waiting' && `Driver arriving in ${driverInfo.eta}`}
          {rideStatus === 'started' && 'Ride in Progress'}
          {rideStatus === 'arrived' && 'You have arrived'}
        </h1>
        <p className="text-[#99A1AF]">
          {rideStatus === 'waiting' && 'Verify the safety code before getting in'}
          {rideStatus === 'started' && 'Enjoy your ride'}
          {rideStatus === 'arrived' && 'Please complete payment'}
        </p>
      </div>

      {/* Safety Code */}
      {rideStatus === 'waiting' && (
        <div className="mx-6 mb-6">
          <SafetyCodeDisplay 
            safetyCode={safetyCode} 
            rideStatus="IN_PROGRESS" 
            isDriver={false} 
          />
          <p className="text-center text-sm text-[#99A1AF] mt-3">
            Ask your driver to verify this code
          </p>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="mx-6 mb-6 h-[300px] bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[18px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/map-pattern.svg')] opacity-20"></div>
        <div className="relative z-10 text-center">
          <Navigation className="w-16 h-16 text-[#DC143C] mx-auto mb-3" />
          <p className="text-white font-medium">Live Tracking</p>
          <p className="text-[#99A1AF] text-sm">Follow your ride in real-time</p>
        </div>
      </div>

      {/* Driver Info Card */}
      <div className="mx-6 mb-6 p-6 bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[18px]">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {driverInfo.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-1">{driverInfo.name}</h3>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-400">★</span>
              <span className="text-white">{driverInfo.rating}</span>
            </div>
            <p className="text-sm text-[#99A1AF] mt-1">
              {driverInfo.car} • {driverInfo.plate}
            </p>
          </div>
        </div>

        {rideStatus === 'waiting' && (
          <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-[12px] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-blue-400">
              Driver will arrive in {driverInfo.eta}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#DC143C] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">Pickup</p>
              <p className="text-sm text-white">{driverInfo.origin}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">Destination</p>
              <p className="text-sm text-white">{driverInfo.destination}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
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
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/safety')}
              className="flex-1 h-[54px] bg-gradient-to-b from-red-600 to-red-800 rounded-[18px] flex items-center justify-center gap-2 text-white"
            >
              <Shield className="w-5 h-5" />
              Emergency
            </button>
            <button 
              onClick={() => router.push('/dashboard/rider')}
              className="flex-1 h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center gap-2 text-white"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-6 space-y-3">
        {rideStatus === 'arrived' && (
          <Button
            onClick={handleArrived}
            className="w-full h-[63px] bg-gradient-to-b from-green-600 to-green-800 text-white rounded-[18px] font-medium"
          >
            Complete & Pay
          </Button>
        )}
      </div>
    </div>
  );
}

export default function RiderRideInProgressPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]" />}>
      <RideInProgressContent />
    </Suspense>
  );
}
