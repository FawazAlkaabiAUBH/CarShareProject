'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { CheckCircle2, Phone, MessageCircle, MapPin, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function MatchFoundContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const driverId = searchParams?.get('driverId');
  const [loading, setLoading] = useState(false);

  const driverInfo = {
    name: 'Fawaz Alkaabi',
    phone: '+973-9876-5432',
    rating: 4.9,
    totalRides: 47,
    car: 'Toyota Camry',
    color: 'Silver',
    plate: '12345',
    origin: 'AUBH Campus',
    destination: 'City Centre Mall',
    fare: 3.40,
    eta: '5 min',
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    // TODO: Create booking via API
    setTimeout(() => {
      router.push(`/rider/ride-in-progress?driverId=${driverId}`);
    }, 1000);
  };

  const handleDecline = () => {
    router.push('/rider/available-drivers');
  };

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
              {driverInfo.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-1">{driverInfo.name}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm">{driverInfo.rating}</span>
              </div>
              <span className="text-[#99A1AF] text-sm">
                {driverInfo.totalRides} rides
              </span>
            </div>
          </div>
        </div>

        {/* Car Info */}
        <div className="p-4 bg-white/5 rounded-[12px] mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#99A1AF] text-sm">Vehicle</span>
            <span className="text-white font-medium">{driverInfo.car}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#99A1AF] text-sm">Color</span>
            <span className="text-white">{driverInfo.color}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#99A1AF] text-sm">Plate</span>
            <span className="text-white font-mono">{driverInfo.plate}</span>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#DC143C] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">Pickup</p>
              <p className="text-sm text-white">{driverInfo.origin}</p>
            </div>
            <span className="text-xs text-[#99A1AF]">{driverInfo.eta}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#99A1AF]">Destination</p>
              <p className="text-sm text-white">{driverInfo.destination}</p>
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
          <span className="text-white font-medium">Trip Fare</span>
          <span className="text-2xl font-bold text-white">
            BHD {driverInfo.fare.toFixed(2)}
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
