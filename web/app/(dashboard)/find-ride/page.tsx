'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';
import { ChevronLeft, MapPin, Navigation, Calendar, User, Clock, Car } from 'lucide-react';

interface Ride {
  rideId: number;
  userId: number;
  origin: string;
  destination: string;
  departureTime: string;
  farePerSeat: number;
  availableSeats: number;
  rideStatus: string;
  driverName?: string;
  driverPhone?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  distance?: number; // Total ride distance
  distanceToPickup?: number; // Distance from user to pickup
  distanceToDropoff?: number; // Distance from destination to dropoff
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchMode, setSearchMode] = useState<'text' | 'nearby'>('text');
  const [maxDistance, setMaxDistance] = useState(10); // km
  const [locationError, setLocationError] = useState<string>('');

  useEffect(() => {
    fetchAvailableRides();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Location access denied or unavailable
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    }
  };

  const fetchNearbyRides = async () => {
    let locationToUse = userLocation;
    setLocationError('');

    if (!locationToUse) {
      // Try to get location again when user clicks
      if (navigator.geolocation) {
        try {
          setLoading(true);
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 0
            });
          });
          locationToUse = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(locationToUse);
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          let errorMessage = 'Unable to get your location. ';
          if (error.code === 1) {
            errorMessage += 'Please enable location permissions in your browser settings.';
          } else if (error.code === 2) {
            errorMessage += 'Location information is unavailable.';
          } else if (error.code === 3) {
            errorMessage += 'Location request timed out.';
          } else {
            errorMessage += 'Please try again.';
          }
          setLocationError(errorMessage);
          return;
        }
      } else {
        setLocationError('Geolocation is not supported by your browser.');
        return;
      }
    }

    setLoading(true);
    setSearchMode('nearby');
    try {
      const response = await apiClient.get(
        `/rides/nearby/location?lat=${locationToUse.lat}&lng=${locationToUse.lng}&radius=${maxDistance}`
      );
      setRides(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch nearby rides:', error);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRides = async () => {
    setLoading(true);
    setSearchMode('text');
    try {
      // Use search endpoint with optional parameters
      const params = new URLSearchParams();
      if (searchParams.pickup) {
        params.append('origin', searchParams.pickup);
      }
      if (searchParams.dropoff) {
        params.append('destination', searchParams.dropoff);
      }
      
      const endpoint = params.toString() 
        ? `/rides/search?${params.toString()}`
        : '/rides/search';
      
      const response = await apiClient.get(endpoint);
      setRides(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch rides:', error);
      setRides([]);
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
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-medium text-white">Find a Ride</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Location Error Message */}
        {locationError && (
          <Card variant="glass" className="border-2 border-red-500/50 bg-red-500/10">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-500 font-medium mb-1">Location Error</p>
                <p className="text-red-400 text-sm">{locationError}</p>
              </div>
              <button
                onClick={() => setLocationError('')}
                className="text-red-400 hover:text-red-300 text-xl leading-none"
              >
                ×
              </button>
            </div>
          </Card>
        )}

        {/* Search Section */}
        <Card variant="default">
          <div className="space-y-4">
            <Input
              placeholder="Pickup Location"
              value={searchParams.pickup}
              onChange={(e) => setSearchParams({ ...searchParams, pickup: e.target.value })}
              icon={<MapPin className="w-5 h-5" />}
            />

            <Input
              placeholder="Dropoff Location"
              value={searchParams.dropoff}
              onChange={(e) => setSearchParams({ ...searchParams, dropoff: e.target.value })}
              icon={<Navigation className="w-5 h-5" />}
            />

            <Input
              type="date"
              placeholder="Date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              icon={<Calendar className="w-5 h-5" />}
            />

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={fetchAvailableRides}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </span>
              ) : (
                'Search Rides'
              )}
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
                <Car className="w-16 h-16 mx-auto mb-4 text-[#6a7282]" />
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
                      <User className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Driver Name */}
                      <p className="text-sm text-[#99a1af] mb-2">{ride.driverName || 'Unknown Driver'}</p>
                      
                      {/* Route */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                          <p className="text-white font-medium truncate">{ride.origin}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#dc143c] rounded-full" />
                          <p className="text-white font-medium truncate">{ride.destination}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4 text-sm text-[#99a1af]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {ride.departureTime ? new Date(ride.departureTime).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : 'Invalid Date'}
                        </span>
                        <span>{ride.availableSeats} seats</span>
                      </div>

                      {/* Distance Info */}
                      {(ride.distance || ride.distanceToPickup) && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-[#99a1af]">
                          {ride.distanceToPickup !== undefined && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {ride.distanceToPickup.toFixed(1)}km to pickup
                            </span>
                          )}
                          {ride.distance !== undefined && (
                            <span className="flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              {ride.distance.toFixed(1)}km trip
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#dc143c]">
                        {ride.farePerSeat.toFixed(2)} BD
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
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => {
                setSearchMode('text');
                fetchAvailableRides();
              }}
              className={`px-4 py-2 border rounded-full whitespace-nowrap text-sm ${
                searchMode === 'text' 
                  ? 'bg-[#dc143c]/20 border-[#dc143c] text-[#dc143c]'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              All Rides
            </button>
            <button 
              onClick={fetchNearbyRides}
              disabled={!userLocation}
              className={`px-4 py-2 border rounded-full whitespace-nowrap text-sm flex items-center gap-2 ${
                searchMode === 'nearby'
                  ? 'bg-[#dc143c]/20 border-[#dc143c] text-[#dc143c]'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Navigation className="w-4 h-4" />
              Rides Near Me
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full whitespace-nowrap text-sm hover:bg-white/10">
              Today
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full whitespace-nowrap text-sm hover:bg-white/10">
              Tomorrow
            </button>
          </div>

          {/* Distance slider for nearby search */}
          {searchMode === 'nearby' && (
            <Card variant="glass" className="p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-white">Search Radius</label>
                <span className="text-sm font-medium text-[#dc143c]">{maxDistance}km</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                onMouseUp={fetchNearbyRides}
                onTouchEnd={fetchNearbyRides}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #dc143c 0%, #dc143c ${(maxDistance / 50) * 100}%, rgba(255,255,255,0.1) ${(maxDistance / 50) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
