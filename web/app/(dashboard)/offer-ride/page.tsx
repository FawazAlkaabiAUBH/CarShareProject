'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';

export default function OfferRidePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupTime: '',
    availableSeats: '4',
    fareEstimate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleOfferRide = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await apiClient.post('/rides', {
        driverId: user.userId,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        pickupTime: new Date(formData.pickupTime).toISOString(),
        availableSeats: parseInt(formData.availableSeats),
        fareEstimate: parseFloat(formData.fareEstimate) || 0,
        rideStatus: 'AVAILABLE',
      });

      if (response.data) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to create ride:', error);
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
          <h1 className="text-xl font-medium text-white">Offer a Ride</h1>
        </div>
      </div>

      <form onSubmit={handleOfferRide} className="max-w-md mx-auto p-6 space-y-6">
        <Card variant="default">
          <div className="space-y-4">
            <Input
              placeholder="Pickup Location"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              required
              icon={
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 1v3M10 16v3M1 10h3M16 10h3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />

            <Input
              placeholder="Dropoff Location"
              value={formData.dropoffLocation}
              onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
              required
              icon={
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2v16M10 18l-4-4M10 18l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />

            <Input
              type="datetime-local"
              placeholder="Pickup Time"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              required
              icon={
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />

            <div>
              <label className="block text-sm font-medium text-[#d1d5dc] mb-2">
                Available Seats
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1', '2', '3', '4'].map((seats) => (
                  <button
                    key={seats}
                    type="button"
                    onClick={() => setFormData({ ...formData, availableSeats: seats })}
                    className={`h-12 rounded-[18px] border-2 transition-all ${
                      formData.availableSeats === seats
                        ? 'bg-[#dc143c]/20 border-[#dc143c] text-white'
                        : 'bg-white/5 border-white/10 text-[#99a1af] hover:bg-white/10'
                    }`}
                  >
                    {seats}
                  </button>
                ))}
              </div>
            </div>

            <Input
              type="number"
              step="0.01"
              placeholder="Fare per Seat (BD)"
              value={formData.fareEstimate}
              onChange={(e) => setFormData({ ...formData, fareEstimate: e.target.value })}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 6v8M8 8h3.5a1.5 1.5 0 010 3H8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />
          </div>
        </Card>

        {/* Vehicle Info Card */}
        <Card variant="glass">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-[#dc143c]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" />
            </svg>
            <h3 className="text-white font-medium">Vehicle Information</h3>
          </div>
          <p className="text-sm text-[#99a1af]">
            Make sure your vehicle is in good condition and you have a valid driver's license.
          </p>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating Ride...' : 'Offer Ride'}
        </Button>

        <Card variant="glass">
          <div className="space-y-2 text-sm text-[#99a1af]">
            <p className="flex items-start gap-2">
              <span className="text-[#10b981]">✓</span>
              Be punctual and respect riders' time
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#10b981]">✓</span>
              Keep your vehicle clean and comfortable
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#10b981]">✓</span>
              Follow campus and traffic regulations
            </p>
          </div>
        </Card>
      </form>
    </div>
  );
}
