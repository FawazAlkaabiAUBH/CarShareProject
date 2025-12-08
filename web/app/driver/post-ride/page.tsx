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

export default function PostRidePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    pickupLocation: LocationCoordinates | null;
    destination: LocationCoordinates | null;
    arrivalTime: string;
    availableSeats: number;
  }>({
    pickupLocation: null,
    destination: null,
    arrivalTime: '',
    availableSeats: 1,
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
      const response = await apiClient.post('/rides', {
        origin: formData.pickupLocation.address || `${formData.pickupLocation.lat},${formData.pickupLocation.lng}`,
        destination: formData.destination.address || `${formData.destination.lat},${formData.destination.lng}`,
        departureTime: formData.arrivalTime,
        availableSeats: formData.availableSeats,
        rideStatus: 'OPEN',
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
          {/* Pickup Location */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#DC143C]" />
              Where are you starting?
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
              Where are you going?
            </label>
            <LocationPicker
              initialLocation={formData.destination || undefined}
              onLocationSelect={(location) => setFormData({ ...formData, destination: location })}
              placeholder="Enter destination"
              markerType="destination"
            />
          </div>

          {/* Arrival Time */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#DC143C]" />
              Arrival Time
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

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}
