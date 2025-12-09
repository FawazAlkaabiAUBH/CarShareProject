'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Car, DollarSign, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_DRIVERS = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    initials: 'AH',
    rating: 4.9,
    car: 'Toyota Camry 2021',
    from: 'AUBH Campus',
    to: 'City Centre Mall',
    departureTime: '14:30',
    fare: '5.50',
    distance: '12 km',
  },
  {
    id: 2,
    name: 'Mohammed Ali',
    initials: 'MA',
    rating: 4.7,
    car: 'Nissan Altima 2020',
    from: 'AUBH Campus',
    to: 'City Centre Mall',
    departureTime: '14:45',
    fare: '6.00',
    distance: '12 km',
  },
];

export default function AvailableDriversPage() {
  const router = useRouter();
  const [drivers] = useState(MOCK_DRIVERS);

  const handleSelectDriver = (driverId: number) => {
    router.push(`/rider/match-found?driverId=${driverId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <h1 className="text-2xl font-medium text-white mb-2">Available Drivers</h1>
        <p className="text-lg text-[#99A1AF]">{drivers.length} drivers match your route</p>
      </div>

      {/* Driver List */}
      <div className="px-6 pb-8 space-y-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[27px] p-6"
          >
            {/* Driver Info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-semibold text-white">{driver.initials}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{driver.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm">{driver.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#99A1AF]">
                  <Car className="w-4 h-4" />
                  <span>{driver.car}</span>
                </div>
              </div>
            </div>

            {/* Route Info */}
            <div className="bg-white/5 rounded-[18px] p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#DC143C]" />
                <span className="text-white text-sm">{driver.from}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">{driver.to}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#99A1AF]">Departure: {driver.departureTime}</span>
                <span className="text-[#99A1AF]">{driver.distance}</span>
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold text-white">BHD {driver.fare}</span>
              </div>
              <Button
                variant="primary"
                className="!h-[48px] px-6"
                onClick={() => handleSelectDriver(driver.id)}
              >
                Select Driver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
