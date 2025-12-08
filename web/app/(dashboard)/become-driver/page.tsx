'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';
import { ChevronLeft, Car, CreditCard, Hash, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface User {
  userId: number;
  fullName: string;
  email: string;
}

export default function BecomeDriverPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAlreadyDriver, setIsAlreadyDriver] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    licenseDocument: '',
    vehicleDocument: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehiclePlateNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [licenseFileName, setLicenseFileName] = useState('');
  const [vehicleFileName, setVehicleFileName] = useState('');

  useEffect(() => {
    // Check authentication
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Check if user is already a driver
    apiClient.get(`/drivers/user/${userData.userId}/status`)
      .then(response => {
        if (response.data.isDriver) {
          setIsAlreadyDriver(true);
        }
      })
      .catch(() => {
        // User is not a driver, can continue
      });
  }, [router]);

  const handleFileUpload = (type: 'license' | 'vehicle') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('File must be an image (JPEG, PNG) or PDF');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'license') {
          setFormData({ ...formData, licenseDocument: base64String });
          setLicenseFileName(file.name);
        } else {
          setFormData({ ...formData, vehicleDocument: base64String });
          setVehicleFileName(file.name);
        }
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.licenseNumber || !formData.licenseDocument) {
        setError('Please fill in all license information');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user) return;

      // Create driver profile
      await apiClient.post('/drivers', {
        licenseNumber: formData.licenseNumber,
        licenseDocument: formData.licenseDocument,
      });

      // Create vehicle entry
      await apiClient.post('/vehicles', {
        make: formData.vehicleMake,
        model: formData.vehicleModel,
        year: parseInt(formData.vehicleYear),
        color: formData.vehicleColor,
        plateNumber: formData.vehiclePlateNumber,
        vehicleDocument: formData.vehicleDocument,
      });

      router.push('/dashboard?driver=pending');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isAlreadyDriver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex flex-col">
        <div className="p-6">
          <IconButton
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => router.push('/dashboard')}
          />
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <Card variant="default" className="max-w-md w-full text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-medium text-white">You&apos;re Already a Driver!</h2>
              <p className="text-[#99a1af]">
                You can manage your vehicles and offer rides from your profile.
              </p>
              <Button
                variant="primary"
                size="md"
                className="w-full mt-4"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </Card>
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
          onClick={() => {
            if (step === 1) {
              router.push('/dashboard');
            } else {
              setStep(step - 1);
            }
          }}
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
            Hi {user.fullName}, let&apos;s get you started
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-[#101828] rounded-t-[45px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 pt-9">
        <div className="space-y-6 max-w-md mx-auto">
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-[#dc143c]' : 'bg-white/10'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#dc143c]' : 'bg-white/10'}`} />
          </div>

          {/* Step 1: License Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Driver&apos;s License</h2>
                <p className="text-sm text-[#99a1af]">Upload your valid driver&apos;s license for verification</p>
              </div>
              
              <Input
                type="text"
                label="License Number"
                placeholder="DL12345"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                required
                icon={<CreditCard className="w-5 h-5" />}
              />

              <div>
                <label className="block text-sm font-medium text-[#d1d5dc] mb-3">
                  License Document *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={handleFileUpload('license')}
                    className="hidden"
                    id="license-upload"
                  />
                  <label
                    htmlFor="license-upload"
                    className="flex items-center gap-3 p-4 bg-white/5 border-2 border-white/10 rounded-[18px] hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-[#99a1af]" />
                    <span className="text-[#99a1af] flex-1 text-sm">
                      {licenseFileName || 'Upload license document (JPEG, PNG, PDF)'}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-[#99a1af] mt-1">Max file size: 5MB</p>
              </div>

              <Card variant="glass" className="border-blue-500/20">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-400 font-medium mb-1">Important</p>
                    <p className="text-xs text-[#99a1af]">
                      Your license will be reviewed by our admin team. Make sure all information is clearly visible.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Vehicle Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Vehicle Information</h2>
                <p className="text-sm text-[#99a1af]">Add details about your vehicle</p>
              </div>

              <Input
                type="text"
                label="Vehicle Make"
                placeholder="Toyota"
                value={formData.vehicleMake}
                onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                required
                icon={<Car className="w-5 h-5" />}
              />

              <Input
                type="text"
                label="Vehicle Model"
                placeholder="Camry"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                required
                icon={<Car className="w-5 h-5" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Year"
                  placeholder="2020"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                  required
                  icon={<Hash className="w-5 h-5" />}
                />

                <Input
                  type="text"
                  label="Color"
                  placeholder="Silver"
                  value={formData.vehicleColor}
                  onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                  required
                  icon={<Hash className="w-5 h-5" />}
                />
              </div>

              <Input
                type="text"
                label="Plate Number"
                placeholder="BH-12345"
                value={formData.vehiclePlateNumber}
                onChange={(e) => setFormData({ ...formData, vehiclePlateNumber: e.target.value })}
                required
                icon={<Hash className="w-5 h-5" />}
              />

              <div>
                <label className="block text-sm font-medium text-[#d1d5dc] mb-3">
                  Vehicle Registration *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={handleFileUpload('vehicle')}
                    className="hidden"
                    id="vehicle-upload"
                  />
                  <label
                    htmlFor="vehicle-upload"
                    className="flex items-center gap-3 p-4 bg-white/5 border-2 border-white/10 rounded-[18px] hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-[#99a1af]" />
                    <span className="text-[#99a1af] flex-1 text-sm">
                      {vehicleFileName || 'Upload vehicle registration (JPEG, PNG, PDF)'}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-[#99a1af] mt-1">Max file size: 5MB</p>
              </div>

              <Card variant="glass" className="border-green-500/20">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-400 font-medium mb-1">What happens next?</p>
                    <p className="text-xs text-[#99a1af]">
                      Once verified, you can start offering rides and earning. You&apos;ll be notified when your application is approved.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-[18px] p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleNext}
            disabled={
              loading || 
              (step === 1 && (!formData.licenseNumber || !formData.licenseDocument)) ||
              (step === 2 && (!formData.vehicleMake || !formData.vehicleModel || !formData.vehicleYear ||
                !formData.vehicleColor || !formData.vehiclePlateNumber || !formData.vehicleDocument))
            }
          >
            {loading ? 'Submitting...' : step === 2 ? 'Submit Application' : 'Continue'}
          </Button>

          {step === 1 && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="text-[#99a1af] text-sm hover:text-white transition-colors"
              >
                I&apos;ll do this later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
