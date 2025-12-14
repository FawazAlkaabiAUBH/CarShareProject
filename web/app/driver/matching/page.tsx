'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Users, MapPin, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function MatchingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams?.get('rideId');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!rideId) {
        router.push('/dashboard/driver');
        return;
      }

      try {
        const { bookingsApi, ridesApi } = await import('@/lib/api');
        
        // Get the ride details
        const ride = await ridesApi.getRideById(parseInt(rideId));
        
        // Get all bookings for this ride
        const bookings = await bookingsApi.getBookingsForRide(parseInt(rideId));
        
        // Filter for pending bookings (rider requests)
        const pendingBookings = bookings.filter(
          booking => booking.bookingStatus === 'PENDING'
        );

        // Format matches with booking data
        const formattedMatches = pendingBookings.map(booking => ({
          id: booking.userId,
          bookingId: booking.bookingId,
          name: 'Rider',
          rating: 5.0,
          origin: ride.origin,
          destination: ride.destination,
          seatsBooked: booking.seatsBooked,
        }));

        setMatches(formattedMatches);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [rideId, router]);

  const handleAcceptRider = async (riderId: number, bookingId: number) => {
    try {
      const { bookingsApi } = await import('@/lib/api');
      
      // Update booking status to CONFIRMED
      await bookingsApi.updateBookingStatus(bookingId, {
        status: 'CONFIRMED',
      });

      // Navigate to ride in progress
      router.push(`/driver/ride-in-progress?rideId=${rideId}&riderId=${riderId}`);
    } catch (error) {
      console.error('Failed to accept rider:', error);
      alert('Failed to accept rider. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/driver');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-white">Finding Riders</h1>
          <button
            onClick={handleCancel}
            className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center"
          >
            <X className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 border-4 border-[#DC143C]/30 border-t-[#DC143C] rounded-full animate-spin mb-6"></div>
            <p className="text-lg text-[#99A1AF]">Searching for riders...</p>
          </div>
        )}

        {/* Matches List */}
        {!loading && matches.length > 0 && (
          <div className="space-y-4">
            <p className="text-[#99A1AF]">Found {matches.length} potential riders</p>
            {matches.map((match) => (
              <div
                key={match.id}
                className="p-6 bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[18px]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">
                      {match.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white">{match.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white">{match.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#DC143C] mt-0.5" />
                    <div>
                      <p className="text-xs text-[#99A1AF]">Pickup</p>
                      <p className="text-sm text-white">{match.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#99A1AF]">Destination</p>
                      <p className="text-sm text-white">{match.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAcceptRider(match.id, match.bookingId)}
                    className="flex-1 h-[54px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] text-white rounded-[18px]"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => {}}
                    className="h-[54px] px-6 bg-[#1E2939] border-2 border-[#364153] text-white rounded-[18px]"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Matches */}
        {!loading && matches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="w-20 h-20 text-[#99A1AF] mb-6" />
            <h3 className="text-xl font-medium text-white mb-2">No riders yet</h3>
            <p className="text-[#99A1AF] text-center mb-6">
              Keep the app open to receive booking requests
            </p>
            <Button
              onClick={handleCancel}
              className="px-8 py-3 bg-gradient-to-b from-[#DC143C] to-[#8B0000] text-white rounded-[18px]"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]" />}>
      <MatchingContent />
    </Suspense>
  );
}
