'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';
import { ChevronLeft, Car, CreditCard, Hash, CheckCircle } from 'lucide-react';

export default function BecomeDriverPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ userId: number; name: string; role: string } | null>(null);
  const [isAlreadyDriver, setIsAlreadyDriver] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    vehicleModel: '',
    vehicleColor: '',
    vehiclePlateNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Check if user is already a driver
    checkIfDriver(userData.userId);
  }, []);

  const checkIfDriver = async (userId: number) => {
    try {
      const response = await apiClient.get(`/drivers/user/${userId}`);
      if (response.data) {
        setIsAlreadyDriver(true);
      }
    } catch {
      // User is not a driver yet, which is expected
      setIsAlreadyDriver(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create driver profile
      const vehicleInfo = `${formData.vehicleModel} | ${formData.vehicleColor} | ${formData.vehiclePlateNumber}`;
      
      const response = await apiClient.post('/drivers', {
        userId: user.userId,
        vehicleInfo,
        licenseNumber: formData.licenseNumber,
        isVerified: false,
        rating: 5.0,
        totalRides: 0,
      });

      if (response.data) {
        // Update user role to DRIVER
        await apiClient.put(`/users/${user.userId}`, {
          role: 'DRIVER',
        });

        // Update local storage
        const updatedUser = { ...user, role: 'DRIVER' };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setSuccess(true);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register as driver. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isAlreadyDriver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#101828] rounded-[27px] p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-medium text-white mb-4">You&apos;re Already a Driver!</h1>
          <p className="text-[#99a1af] mb-6">
            You already have a driver profile. Start offering rides now!
          </p>
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => router.push('/offer-ride')}
          >
            Offer a Ride
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#101828] rounded-[27px] p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-medium text-white mb-4">Welcome to the Driver Community!</h1>
          <p className="text-[#99a1af] mb-6">
            Your driver profile has been created successfully. Our team will verify your information, and you&apos;ll be able to start offering rides soon!
          </p>
          <p className="text-sm text-[#99a1af]">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <IconButton
          icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
          onClick={() => router.back()}
        />
      </div>

      {/* Logo Section */}
      <div className="flex-shrink-0 flex flex-col items-center pt-12 pb-8">
        <div className="w-[108px] h-[108px] bg-gradient-to-b from-[#002d72] to-[#dc143c] rounded-[27px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-center justify-center mb-8">
          <Car className="w-12 h-12 text-white" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-white tracking-tight">
            Become a Driver
          </h1>
          <p className="text-lg text-[#99a1af] tracking-tight">
            Start earning by sharing rides
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-[#101828] rounded-t-[45px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 pt-9">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-[18px] p-4">
            <p className="text-sm text-blue-400">
              <strong>Hi {user?.name}!</strong> To start offering rides, please provide your vehicle information below.
            </p>
          </div>

          <Input
            type="text"
            label="Driver License Number"
            placeholder="DL12345"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            required
            icon={<CreditCard className="w-5 h-5" />}
          />

          <Input
            type="text"
            label="Vehicle Model"
            placeholder="Toyota Camry 2020"
            value={formData.vehicleModel}
            onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
            required
            icon={<Car className="w-5 h-5" />}
          />

          <Input
            type="text"
            label="Vehicle Color"
            placeholder="Silver"
            value={formData.vehicleColor}
            onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
            required
            icon={<Hash className="w-5 h-5" />}
          />

          <Input
            type="text"
            label="Plate Number"
            placeholder="BH-12345"
            value={formData.vehiclePlateNumber}
            onChange={(e) => setFormData({ ...formData, vehiclePlateNumber: e.target.value })}
            required
            icon={<Hash className="w-5 h-5" />}
          />

          <div className="bg-yellow-500/10 border-2 border-yellow-500/20 rounded-[18px] p-4">
            <p className="text-sm text-yellow-400">
              <strong>Verification Required:</strong> Your vehicle information will be verified by our team before you can start offering rides. This usually takes 24-48 hours.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-[18px] p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Driver'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="text-[#99a1af] hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
