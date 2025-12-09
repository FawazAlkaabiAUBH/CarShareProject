'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Clock, Users as UsersIcon, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LocationCoordinates } from '@/components/LocationPicker';
import { apiClient } from '@/lib/api';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

export default function RideRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    pickupLocation: LocationCoordinates | null;
    destination: LocationCoordinates | null;
    pickupTime: string;
    passengers: number;
  }>({
    pickupLocation: null,
    destination: null,
    pickupTime: '',
    passengers: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate location selection
    if (!formData.pickupLocation || !formData.destination) {
      setError('Please select both pickup location and destination');
      return;
    }

    setLoading(true);

    try {
      // Search for available rides using nearby search
      const response = await apiClient.get('/rides/nearby/search', {
        params: {
          lat: formData.pickupLocation.lat,
          lng: formData.pickupLocation.lng,
          destLat: formData.destination.lat,
          destLng: formData.destination.lng,
          maxPickupDistance: 5,
          maxDropoffDistance: 5,
          startDate: formData.pickupTime,
        },
      });

      // Navigate to available drivers
      router.push('/rider/available-drivers');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to find rides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <button
          onClick={() => router.push('/dashboard/rider')}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>

        <h1 className="text-2xl font-medium text-white mb-2">Book a Ride</h1>
        <p className="text-lg text-[#99A1AF]">Find your perfect match</p>
      </div>

      {/* Form */}
      <div className="px-6 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup Location */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#DC143C]" />
              Where should we pick you up?
            </label>
            <LocationPicker
              initialLocation={formData.pickupLocation || undefined}
              onLocationSelect={(location) => setFormData({ ...formData, pickupLocation: location })}
              placeholder="Enter pickup location"
              markerType="origin"
            />
          </div>

          {/* Destination */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#DC143C]" />
              Destination
            </label>
            <LocationPicker
              initialLocation={formData.destination || undefined}
              onLocationSelect={(location) => setFormData({ ...formData, destination: location })}
              placeholder="Where are you going?"
              markerType="destination"
            />
          </div>

          {/* Pickup Time */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#DC143C]" />
              Pickup Time
            </label>
            <Input
              type="datetime-local"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              className="w-full h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-4 text-white"
              required
            />
          </div>

          {/* Number of Passengers */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-[#DC143C]" />
              Number of Passengers
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, passengers: Math.max(1, formData.passengers - 1) })}
                className="w-[54px] h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center hover:border-[#DC143C] transition-colors"
              >
                <Minus className="w-6 h-6 text-white" />
              </button>
              <div className="flex-1 h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">{formData.passengers}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, passengers: Math.min(4, formData.passengers + 1) })}
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
            {loading ? 'Searching...' : 'Book a Ride'}
          </Button>
        </form>
      </div>
    </div>
  );
}
