'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FareSummary } from '@/components/FareSummary';

function FareSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams?.get('rideId');

  const rideDetails = {
    origin: 'AUBH Campus',
    destination: 'City Centre Mall',
    distance: '5.2 km',
    duration: '18 min',
    rider: 'Fatima Hassan',
    baseFare: 2.50,
    distanceFare: 1.30,
    serviceFee: 0.40,
    total: 3.40,
    yourEarnings: 3.00,
  };

  const handleContinue = () => {
    router.push('/feedback');
  };

  const handleSkipToHome = () => {
    router.push('/dashboard/driver');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29] pb-8">
      {/* Success Header */}
      <div className="px-6 pt-[27px] pb-6 text-center">
        <div className="w-[108px] h-[108px] mx-auto mb-6 bg-gradient-to-b from-green-600 to-green-800 rounded-[27px] shadow-2xl flex items-center justify-center">
          <CheckCircle2 className="w-[72px] h-[72px] text-white" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-medium text-white mb-2">Ride Completed!</h1>
        <p className="text-[#99A1AF]">Great job driving safely</p>
      </div>

      {/* Ride Summary */}
      <div className="mx-6 mb-6 p-6 bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[18px]">
        <h3 className="text-lg font-medium text-white mb-4">Trip Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#DC143C] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">From</p>
              <p className="text-sm text-white">{rideDetails.origin}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">To</p>
              <p className="text-sm text-white">{rideDetails.destination}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-[12px]">
          <div className="text-center">
            <Clock className="w-5 h-5 text-[#99A1AF] mx-auto mb-1" />
            <p className="text-xs text-[#99A1AF]">Duration</p>
            <p className="text-sm font-medium text-white">{rideDetails.duration}</p>
          </div>
          <div className="text-center">
            <MapPin className="w-5 h-5 text-[#99A1AF] mx-auto mb-1" />
            <p className="text-xs text-[#99A1AF]">Distance</p>
            <p className="text-sm font-medium text-white">{rideDetails.distance}</p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 text-[#99A1AF] mx-auto mb-1" />
            <p className="text-xs text-[#99A1AF]">Rider</p>
            <p className="text-sm font-medium text-white">1</p>
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="mx-6 mb-6">
        <FareSummary
          baseFare={rideDetails.baseFare}
          distanceFare={rideDetails.distanceFare}
          serviceFee={rideDetails.serviceFee}
          totalFare={rideDetails.total}
          driverEarnings={rideDetails.total}
          isDriver={true}
        />
        
        <div className="mt-4 p-4 bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 rounded-[18px]">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Your Earnings</span>
            <span className="text-2xl font-bold text-green-400">
              BHD {rideDetails.yourEarnings.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-6 space-y-3">
        <Button
          onClick={handleContinue}
          className="w-full h-[63px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] text-white rounded-[18px] font-medium"
        >
          Rate Your Rider
        </Button>
        <button
          onClick={handleSkipToHome}
          className="w-full text-[#99A1AF] font-medium"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

export default function DriverFareSummaryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]" />}>
      <FareSummaryContent />
    </Suspense>
  );
}
