'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { MapPin, Phone, MessageCircle, Shield, Navigation, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SafetyCodeDisplay } from '@/components/SafetyCodeDisplay';

function RideInProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams?.get('rideId');
  const riderId = searchParams?.get('riderId');
  
  const [rideStatus, setRideStatus] = useState<'waiting' | 'started' | 'arrived'>('waiting');
  const [safetyCode] = useState('4231');

  const riderInfo = {
    name: 'Sara Ali',
    phone: '+973-1234-5678',
    rating: 4.9,
    origin: 'AUBH Campus',
    destination: 'City Centre Mall',
  };

  const handleStartRide = () => {
    setRideStatus('started');
    // TODO: Update ride status via API
  };

  const handleCompleteRide = () => {
    // TODO: Complete ride via API
    router.push(`/driver/fare-summary?rideId=${rideId}`);
  };

  const handleEmergency = () => {
    router.push('/safety');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <h1 className="text-2xl font-medium text-white mb-2">
          {rideStatus === 'waiting' && 'Waiting for Rider'}
          {rideStatus === 'started' && 'Ride in Progress'}
          {rideStatus === 'arrived' && 'Arrived at Destination'}
        </h1>
        <p className="text-[#99A1AF]">
          {rideStatus === 'waiting' && 'Share the safety code with your rider'}
          {rideStatus === 'started' && 'Drive safely'}
          {rideStatus === 'arrived' && 'Complete the ride'}
        </p>
      </div>

      {/* Safety Code */}
      {rideStatus === 'waiting' && (
        <div className="mx-6 mb-6">
          <SafetyCodeDisplay 
            safetyCode={safetyCode} 
            rideStatus="BOOKED" 
            isDriver={true} 
          />
        </div>
      )}

      {/* Map Placeholder */}
      <div className="mx-6 mb-6 h-[300px] bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[18px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/map-pattern.svg')] opacity-20"></div>
        <div className="relative z-10 text-center">
          <Navigation className="w-16 h-16 text-[#DC143C] mx-auto mb-3" />
          <p className="text-white font-medium">Live Map</p>
          <p className="text-[#99A1AF] text-sm">Navigate to destination</p>
        </div>
      </div>

      {/* Rider Info Card */}
      <div className="mx-6 mb-6 p-6 bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[18px]">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {riderInfo.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-1">{riderInfo.name}</h3>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-400">★</span>
              <span className="text-white">{riderInfo.rating}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#DC143C] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">Pickup</p>
              <p className="text-sm text-white">{riderInfo.origin}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">Destination</p>
              <p className="text-sm text-white">{riderInfo.destination}</p>
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
              onClick={() => router.push('/dashboard/driver')}
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
        {rideStatus === 'waiting' && (
          <Button
            onClick={handleStartRide}
            className="w-full h-[63px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] text-white rounded-[18px] font-medium"
          >
            Start Ride
          </Button>
        )}

        {rideStatus === 'started' && (
          <Button
            onClick={handleCompleteRide}
            className="w-full h-[63px] bg-gradient-to-b from-green-600 to-green-800 text-white rounded-[18px] font-medium"
          >
            Complete Ride
          </Button>
        )}
      </div>
          <Shield className="w-5 h-5" />
          Emergency
        </button>
      </div>
    </div>
  );
}

export default function RideInProgressPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]" />}>
      <RideInProgressContent />
    </Suspense>
  );
}
