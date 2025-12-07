'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';
import { ChevronLeft, MapPin, Navigation, Clock, DollarSign, Car, AlertCircle, Plus } from 'lucide-react';

interface Vehicle {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  isActive: boolean;
}

export default function OfferRidePage() {
  const router = useRouter();
  const [isDriver, setIsDriver] = useState<boolean | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupTime: '',
    availableSeats: '4',
    fareEstimate: '',
    vehicleId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkDriverStatus();
  }, []);

  const checkDriverStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserId(user.userId);
      
      // Check if user has a driver profile
      const driverResponse = await apiClient.get(`/drivers/user/${user.userId}`);
      
      if (driverResponse.data && driverResponse.data.isVerified) {
        setIsDriver(true);
        
        // Fetch active vehicles
        const vehiclesResponse = await apiClient.get('/vehicles/my/active');
        setVehicles(vehiclesResponse.data);
        
        // Set default vehicle if available
        if (vehiclesResponse.data.length > 0) {
          setFormData(prev => ({ ...prev, vehicleId: vehiclesResponse.data[0].vehicleId.toString() }));
        }
      } else if (driverResponse.data && !driverResponse.data.isVerified) {
        setIsDriver(false);
        setError('Your driver account is pending verification.');
      } else {
        setIsDriver(false);
      }
    } catch {
      // User is not a driver
      setIsDriver(false);
    }
  };

  const handleOfferRide = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.vehicleId) {
        setError('Please select a vehicle');
        setLoading(false);
        return;
      }

      const response = await apiClient.post('/rides', {
        userId: userId,
        vehicleId: parseInt(formData.vehicleId),
        origin: formData.pickupLocation,
        destination: formData.dropoffLocation,
        departureTime: new Date(formData.pickupTime).toISOString(),
        availableSeats: parseInt(formData.availableSeats),
        farePerSeat: parseFloat(formData.fareEstimate) || 0,
        rideStatus: 'AVAILABLE',
      });

      if (response.data) {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ride. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isDriver === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Not a driver - show upgrade prompt
  if (!isDriver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-24">
        {/* Header */}
        <div className="bg-[#101828] border-b-2 border-white/10 p-6">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <IconButton
              icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
              onClick={() => router.back()}
            />
            <h1 className="text-xl font-medium text-white">Offer a Ride</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto p-6">
          <Card variant="default">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-[#dc143c]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-[#dc143c]" />
              </div>
              <h2 className="text-2xl font-medium text-white mb-4">
                Driver Registration Required
              </h2>
              <p className="text-[#99a1af] mb-8">
                To offer rides, you need to register as a driver. This only takes a few minutes!
              </p>
              <Button
                variant="primary"
                size="md"
                className="w-full mb-4"
                onClick={() => router.push('/signup/driver')}
              >
                Become a Driver
              </Button>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-[#99a1af] hover:text-white transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-24">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <IconButton
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-medium text-white">Offer a Ride</h1>
        </div>
      </div>

      <form onSubmit={handleOfferRide} className="max-w-md mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-[18px] p-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <Card variant="default">
          <div className="space-y-4">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-[#d1d5dc] mb-3">
                Select Vehicle *
              </label>
              {vehicles.length === 0 ? (
                <div className="bg-yellow-500/10 border-2 border-yellow-500/20 rounded-[18px] p-4">
                  <p className="text-sm text-yellow-400 mb-3">
                    You don&apos;t have any active vehicles. Add a vehicle to your profile first.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/profile')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.vehicleId}
                      type="button"
                      onClick={() => setFormData({ ...formData, vehicleId: vehicle.vehicleId.toString() })}
                      className={`w-full p-4 rounded-[18px] border-2 transition-all text-left ${
                        formData.vehicleId === vehicle.vehicleId.toString()
                          ? 'bg-[#dc143c]/20 border-[#dc143c]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-[#dc143c]" />
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {vehicle.make} {vehicle.model} {vehicle.year}
                          </p>
                          <p className="text-[#99a1af] text-sm">
                            {vehicle.color} • {vehicle.plateNumber}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Input
              placeholder="Pickup Location"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              required
              icon={<MapPin className="w-5 h-5" />}
            />

            <Input
              placeholder="Dropoff Location"
              value={formData.dropoffLocation}
              onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
              required
              icon={<Navigation className="w-5 h-5" />}
            />

            <Input
              type="datetime-local"
              label="Pickup Time"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              required
              icon={<Clock className="w-5 h-5" />}
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
              label="Fare per Seat (BHD)"
              placeholder="2.50"
              step="0.01"
              value={formData.fareEstimate}
              onChange={(e) => setFormData({ ...formData, fareEstimate: e.target.value })}
              icon={<DollarSign className="w-5 h-5" />}
            />
          </div>
        </Card>

        {error && (
          <Card variant="default">
            <div className="bg-red-500/10 border border-red-500/50 rounded-[18px] p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* Vehicle Info Card */}
        <Card variant="glass">
          <div className="flex items-center gap-3 mb-3">
            <Car className="w-6 h-6 text-[#dc143c]" />
            <h3 className="text-white font-medium">Vehicle Information</h3>
          </div>
          <p className="text-sm text-[#99a1af]">
            Make sure your vehicle is in good condition and you have a valid driver&apos;s license.
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
              Be punctual and respect riders&apos; time
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
