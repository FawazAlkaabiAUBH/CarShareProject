'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';

interface Ride {
  rideId: number;
  driverId: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  fareEstimate: number;
  availableSeats: number;
  rideStatus: string;
}

export default function FindRidePage() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    pickup: '',
    dropoff: '',
    date: '',
  });

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  const fetchAvailableRides = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/rides/available');
      setRides(response.data);
    } catch (error) {
      console.error('Failed to fetch rides:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-24">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <IconButton
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#d1d5dc" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-medium text-white">Find a Ride</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Search Section */}
        <Card variant="default">
          <div className="space-y-4">
            <Input
              placeholder="Pickup Location"
              value={searchParams.pickup}
              onChange={(e) => setSearchParams({ ...searchParams, pickup: e.target.value })}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 1v3M10 16v3M1 10h3M16 10h3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />

            <Input
              placeholder="Dropoff Location"
              value={searchParams.dropoff}
              onChange={(e) => setSearchParams({ ...searchParams, dropoff: e.target.value })}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2v16M10 18l-4-4M10 18l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />

            <Input
              type="date"
              placeholder="Date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={fetchAvailableRides}
            >
              Search Rides
            </Button>
          </div>
        </Card>

        {/* Available Rides */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">
            Available Rides ({rides.length})
          </h2>

          {loading ? (
            <Card variant="glass">
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-[#dc143c] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#99a1af]">Loading rides...</p>
              </div>
            </Card>
          ) : rides.length === 0 ? (
            <Card variant="glass">
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#6a7282]" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" />
                  <circle cx="16" cy="48" r="6" stroke="currentColor" strokeWidth="2" />
                  <circle cx="48" cy="48" r="6" stroke="currentColor" strokeWidth="2" />
                </svg>
                <p className="text-[#99a1af]">No rides available</p>
                <p className="text-sm text-[#6a7282] mt-2">Try adjusting your search</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <Card
                  key={ride.rideId}
                  variant="glass"
                  className="cursor-pointer hover:bg-white/10"
                  onClick={() => router.push(`/ride/${ride.rideId}`)}
                >
                  <div className="flex items-start gap-4">
                    {/* Driver Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-b from-[#dc143c] to-[#8b0000] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
                        <path d="M4 20a8 8 0 0116 0" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Route */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                          <p className="text-white font-medium truncate">{ride.pickupLocation}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#dc143c] rounded-full" />
                          <p className="text-white font-medium truncate">{ride.dropoffLocation}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4 text-sm text-[#99a1af]">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                          {new Date(ride.pickupTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>{ride.availableSeats} seats</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#dc143c]">
                        {ride.fareEstimate.toFixed(2)} BD
                      </p>
                      <p className="text-xs text-[#99a1af]">per seat</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-[#dc143c]/20 border border-[#dc143c] text-[#dc143c] rounded-full whitespace-nowrap text-sm">
            All Rides
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full whitespace-nowrap text-sm hover:bg-white/10">
            Today
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full whitespace-nowrap text-sm hover:bg-white/10">
            Tomorrow
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full whitespace-nowrap text-sm hover:bg-white/10">
            This Week
          </button>
        </div>
      </div>
    </div>
  );
}
