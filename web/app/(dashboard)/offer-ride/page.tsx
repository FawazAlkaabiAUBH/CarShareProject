'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { LocationCoordinates } from '@/components/LocationPicker';
import { apiClient } from '@/lib/api';
import { ChevronLeft, Clock, Car, AlertCircle, Plus, Info } from 'lucide-react';
import dynamic from 'next/dynamic';

interface Vehicle {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  isActive: boolean;
}

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPickerDynamic = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-[#1e2939] rounded-[18px] flex items-center justify-center text-[#99a1af]">Loading map...</div>,
});

export default function OfferRidePage() {
  const router = useRouter();
  const [isDriver, setIsDriver] = useState<boolean | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState({
    origin: null as LocationCoordinates | null,
    destination: null as LocationCoordinates | null,
    departureTime: '',
    availableSeats: '4',
    vehicleId: '',
    estimatedDuration: '',
  });
  const [calculatedFare, setCalculatedFare] = useState<{
    distance: number;
    baseFare: number;
    distanceFare: number;
    serviceFee: number;
    totalFare: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkDriverStatus();
  }, []);

  // Calculate fare when both locations are selected
  useEffect(() => {
    if (formData.origin && formData.destination) {
      const distance = calculateDistance(
        formData.origin.lat,
        formData.origin.lng,
        formData.destination.lat,
        formData.destination.lng
      );

      // Backend fare calculation logic (matching backend)
      const BASE_FARE = 0.5;
      const FARE_PER_KM = 0.15;
      const SERVICE_FEE_PERCENTAGE = 0.1;

      const baseFare = BASE_FARE;
      const distanceFare = distance * FARE_PER_KM;
      const subtotal = baseFare + distanceFare;
      const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;
      const totalFare = subtotal + serviceFee;

      setCalculatedFare({
        distance,
        baseFare,
        distanceFare,
        serviceFee,
        totalFare,
      });
    } else {
      setCalculatedFare(null);
    }
  }, [formData.origin, formData.destination]);

  const checkDriverStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check if user has a driver profile using status endpoint
      const statusResponse = await apiClient.get(`/drivers/user/${user.userId}/status`);
      
      if (statusResponse.data.isDriver && statusResponse.data.isVerified) {
        setIsDriver(true);
        
        // Fetch active vehicles
        const vehiclesResponse = await apiClient.get('/vehicles/my/active');
        setVehicles(vehiclesResponse.data);
        
        // Set default vehicle if available
        if (vehiclesResponse.data.length > 0) {
          setFormData(prev => ({ ...prev, vehicleId: vehiclesResponse.data[0].vehicleId.toString() }));
        }
      } else if (statusResponse.data.isDriver && !statusResponse.data.isVerified) {
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

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

      if (!formData.origin || !formData.destination) {
        setError('Please select both pickup and dropoff locations on the map');
        setLoading(false);
        return;
      }

      const response = await apiClient.post('/rides', {
        vehicleId: parseInt(formData.vehicleId),
        origin: formData.origin.address || `${formData.origin.lat}, ${formData.origin.lng}`,
        destination: formData.destination.address || `${formData.destination.lat}, ${formData.destination.lng}`,
        originLat: formData.origin.lat,
        originLng: formData.origin.lng,
        destinationLat: formData.destination.lat,
        destinationLng: formData.destination.lng,
        departureTime: new Date(formData.departureTime).toISOString(),
        totalSeats: parseInt(formData.availableSeats),
        estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : undefined,
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

            {/* Pickup Location */}
            <div>
              <LocationPickerDynamic
                label="Pickup Location *"
                placeholder="Search or click on map to select pickup location"
                markerType="origin"
                onLocationSelect={(location) => setFormData({ ...formData, origin: location })}
                initialLocation={formData.origin || undefined}
              />
            </div>

            {/* Dropoff Location */}
            <div>
              <LocationPickerDynamic
                label="Dropoff Location *"
                placeholder="Search or click on map to select dropoff location"
                markerType="destination"
                onLocationSelect={(location) => setFormData({ ...formData, destination: location })}
                initialLocation={formData.destination || undefined}
              />
            </div>

            {/* Fare Preview */}
            {calculatedFare && (
              <div className="bg-[#dc143c]/10 border-2 border-[#dc143c]/30 rounded-[18px] p-4 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-[#dc143c]" />
                  <h3 className="text-white font-medium">Fare Breakdown (Auto-calculated)</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-[#d1d5dc]">
                    <span>Distance:</span>
                    <span>{calculatedFare.distance.toFixed(2)} km</span>
                  </div>
                  <div className="flex justify-between text-[#99a1af]">
                    <span>Base Fare:</span>
                    <span>{calculatedFare.baseFare.toFixed(2)} BHD</span>
                  </div>
                  <div className="flex justify-between text-[#99a1af]">
                    <span>Distance Fare ({calculatedFare.distance.toFixed(2)} km × 0.15):</span>
                    <span>{calculatedFare.distanceFare.toFixed(2)} BHD</span>
                  </div>
                  <div className="flex justify-between text-[#99a1af]">
                    <span>Service Fee (10%):</span>
                    <span>{calculatedFare.serviceFee.toFixed(2)} BHD</span>
                  </div>
                  <div className="flex justify-between text-white font-medium text-base pt-2 border-t border-white/10">
                    <span>Total Fare per Seat:</span>
                    <span>{calculatedFare.totalFare.toFixed(2)} BHD</span>
                  </div>
                </div>
              </div>
            )}

            <Input
              type="datetime-local"
              label="Pickup Time"
              value={formData.departureTime}
              onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
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
              label="Estimated Duration (minutes)"
              placeholder="30"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
              icon={<Clock className="w-5 h-5" />}
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
