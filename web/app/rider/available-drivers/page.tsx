'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Star, Car, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function AvailableDriversContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableRides = async () => {
      try {
        // Get search parameters from URL
        const originLat = parseFloat(searchParams?.get('originLat') || '0');
        const originLng = parseFloat(searchParams?.get('originLng') || '0');
        const destLat = parseFloat(searchParams?.get('destLat') || '0');
        const destLng = parseFloat(searchParams?.get('destLng') || '0');

        if (!originLat || !originLng) {
          // If no coordinates, fetch all available rides
          const { ridesApi } = await import('@/lib/api');
          const availableRides = await ridesApi.getAvailableRides();
          setRides(availableRides);
        } else {
          // Search for nearby rides
          const { ridesApi } = await import('@/lib/api');
          const searchResults = await ridesApi.searchRides({
            lat: originLat,
            lng: originLng,
            destLat,
            destLng,
            maxPickupDistance: 5, // 5km max pickup distance
            maxDropoffDistance: 5, // 5km max dropoff distance
          });
          setRides(searchResults);
        }
      } catch (error) {
        console.error('Failed to fetch available rides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRides();
  }, [searchParams]);

  const handleSelectRide = (rideId: number) => {
    router.push(`/rider/match-found?rideId=${rideId}`);
  };

  const getDriverInitials = (name?: string) => {
    if (!name) return 'DR';
    const parts = name.split(' ');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <h1 className="text-2xl font-medium text-white mb-2">Available Rides</h1>
        <p className="text-lg text-[#99A1AF]">
          {loading ? 'Searching...' : `${rides.length} rides available`}
        </p>
      </div>

      {/* Rides List */}
      <div className="px-6 pb-8 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#DC143C] animate-spin" />
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-[#6A7282] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No rides available</h3>
            <p className="text-[#99A1AF]">Try adjusting your search criteria</p>
          </div>
        ) : (
          rides.map((ride) => {
            const departureDate = new Date(ride.departureTime);
            const timeStr = departureDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const driverName = ride.driver?.name || 'Driver';
            const initials = getDriverInitials(driverName);
            const carInfo = ride.car ? `${ride.car.make} ${ride.car.model} ${ride.car.year}` : 'Vehicle';
            const farePerSeat = ride.farePerSeat || 0;
            const distance = ride.distance ? `${ride.distance.toFixed(1)} km` : 'N/A';

            return (
              <div
                key={ride.rideId}
                className="bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[27px] p-6"
              >
                {/* Driver Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-semibold text-white">{initials}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{driverName}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm">
                        {ride.driver?.rating ? ride.driver.rating.toFixed(1) : '5.0'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#99A1AF]">
                      <Car className="w-4 h-4" />
                      <span>{carInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="bg-white/5 rounded-[18px] p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#DC143C]" />
                    <span className="text-white text-sm">{ride.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">{ride.destination}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#99A1AF]">Departure: {timeStr}</span>
                    <span className="text-[#99A1AF]">{distance}</span>
                  </div>
                  <div className="mt-2 text-sm text-[#99A1AF]">
                    {ride.availableSeats} of {ride.totalSeats} seats available
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-white">BHD {farePerSeat.toFixed(3)}</span>
                  </div>
                  <Button
                    variant="primary"
                    className="!h-[48px] px-6 flex items-center justify-center"
                    onClick={() => handleSelectRide(ride.rideId)}
                  >
                    Select Ride
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function AvailableDriversPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#DC143C] animate-spin" />
      </div>
    }>
      <AvailableDriversContent />
    </Suspense>
  );
}
