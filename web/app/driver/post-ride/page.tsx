'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Clock, Users as UsersIcon, Minus, Plus, Navigation, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LocationCoordinates } from '@/components/LocationPicker';
import { apiClient } from '@/lib/api';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

// AUBH fixed location
const AUBH_LOCATION: LocationCoordinates = {
  lat: 26.1008012,
  lng: 50.5480834,
  address: 'AUBH'
};

export default function PostRidePage() {
  const router = useRouter();
  const [direction, setDirection] = useState<'from-aubh' | 'to-aubh'>('to-aubh'); // Default: going to AUBH
  const [formData, setFormData] = useState<{
    userLocation: LocationCoordinates | null;
    arrivalTime: string;
    availableSeats: number;
  }>({
    userLocation: null,
    arrivalTime: '',
    availableSeats: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    setGettingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        };
        setFormData({ ...formData, userLocation: location });
        setGettingLocation(false);
      },
      (error) => {
        setError('Failed to get your location. Please enable location services.');
        setGettingLocation(false);
      }
    );
  };

  const toggleDirection = () => {
    setDirection(direction === 'to-aubh' ? 'from-aubh' : 'to-aubh');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate location selection
    if (!formData.userLocation) {
      setError('Please select your location');
      return;
    }

    setLoading(true);

    try {
      // Get user's active vehicle
      const vehiclesResponse = await apiClient.get('/vehicles/my/active');
      const vehicles = vehiclesResponse.data;
      
      if (!vehicles || vehicles.length === 0) {
        setError('Please register a vehicle first');
        setLoading(false);
        return;
      }

      // Determine origin and destination based on direction
      const pickupLocation = direction === 'from-aubh' ? AUBH_LOCATION : formData.userLocation;
      const destination = direction === 'to-aubh' ? AUBH_LOCATION : formData.userLocation;

      const response = await apiClient.post('/rides', {
        vehicleId: vehicles[0].vehicleId,
        origin: pickupLocation.address,
        destination: destination.address,
        originLat: pickupLocation.lat,
        originLng: pickupLocation.lng,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
        departureTime: formData.arrivalTime,
        totalSeats: formData.availableSeats,
      });

      // Navigate to matching screen
      router.push(`/driver/matching?rideId=${response.data.rideId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <button
          onClick={() => router.push('/dashboard/driver')}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>

        <h1 className="text-2xl font-medium text-white mb-2">Post a Ride</h1>
        <p className="text-lg text-[#99A1AF]">Share your journey with fellow students</p>
      </div>

      {/* Form */}
      <div className="px-6 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Direction Toggle */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-[#DC143C]" />
              Trip Direction
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDirection('to-aubh')}
                className={`h-[54px] rounded-[18px] flex items-center justify-center gap-2 font-medium transition-all ${
                  direction === 'to-aubh'
                    ? 'bg-gradient-to-b from-[#DC143C] to-[#8B0000] text-white'
                    : 'bg-[#1E2939] border-2 border-[#364153] text-[#99A1AF]'
                }`}
              >
                Going to AUBH
              </button>
              <button
                type="button"
                onClick={() => setDirection('from-aubh')}
                className={`h-[54px] rounded-[18px] flex items-center justify-center gap-2 font-medium transition-all ${
                  direction === 'from-aubh'
                    ? 'bg-gradient-to-b from-[#DC143C] to-[#8B0000] text-white'
                    : 'bg-[#1E2939] border-2 border-[#364153] text-[#99A1AF]'
                }`}
              >
                Leaving from AUBH
              </button>
            </div>
          </div>

          {/* Fixed AUBH Location Display */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#DC143C]" />
              {direction === 'to-aubh' ? 'Destination' : 'Starting Point'}
            </label>
            <div className="h-[54px] bg-[#1E2939] border-2 border-[#DC143C] rounded-[18px] px-4 flex items-center text-white">
              <MapPin className="w-5 h-5 text-[#DC143C] mr-3" />
              <span className="font-medium">AUBH (American University of Bahrain)</span>
            </div>
          </div>

          {/* User Location */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#DC143C]" />
              {direction === 'to-aubh' ? 'Pickup Location' : 'Drop-off Location'}
            </label>
            <LocationPicker
              initialLocation={formData.userLocation || undefined}
              onLocationSelect={(location) => setFormData({ ...formData, userLocation: location })}
              placeholder={direction === 'to-aubh' ? 'Where are you starting from?' : 'Where should riders be dropped off?'}
              markerType={direction === 'to-aubh' ? 'origin' : 'destination'}
            />
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              className="w-full h-[48px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center gap-2 text-white hover:border-[#DC143C] transition-colors disabled:opacity-50"
            >
              <Navigation className="w-5 h-5" />
              {gettingLocation ? 'Getting location...' : 'Use My Current Location'}
            </button>
          </div>

          {/* Arrival Time */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#DC143C]" />
              Departure Time
            </label>
            <Input
              type="datetime-local"
              value={formData.arrivalTime}
              onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              className="w-full h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-4 text-white"
              required
            />
          </div>

          {/* Available Seats */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-[#DC143C]" />
              Available Seats
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, availableSeats: Math.max(1, formData.availableSeats - 1) })}
                className="w-[54px] h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center hover:border-[#DC143C] transition-colors"
              >
                <Minus className="w-6 h-6 text-white" />
              </button>
              <div className="flex-1 h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">{formData.availableSeats}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, availableSeats: Math.min(4, formData.availableSeats + 1) })}
                className="w-[54px] h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center hover:border-[#DC143C] transition-colors"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[18px] text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Posting Ride...' : 'Post Ride'}
          </Button>
        </form>
      </div>
    </div>
  );
}
