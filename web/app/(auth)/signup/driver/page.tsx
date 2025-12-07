'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';
import { ChevronLeft, User, Mail, Phone, Lock, Car, CreditCard, Hash, Upload } from 'lucide-react';

export default function DriverSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // User info
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'DRIVER' as const,
    // Driver specific info
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
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      // Check if user is already a driver
      apiClient.get(`/drivers/user/${user.userId}/status`)
        .then(response => {
          if (response.data.isDriver) {
            // User is already a driver, redirect to dashboard
            router.push('/dashboard');
          }
        })
        .catch(() => {
          // If error, user is not a driver, can continue
        });
    }
  }, [router]);

  const handleNext = () => {
    // Phone validation regex
    const phoneRegex = /^\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    
    if (step === 1) {
      if (!formData.email || !formData.name || !formData.phoneNumber) {
        setError('Please fill in all fields');
        return;
      }
      if (!phoneRegex.test(formData.phoneNumber)) {
        setError('Please enter a valid phone number (e.g., +973-1234-5678 or 17001234)');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2 && formData.password === formData.confirmPassword) {
      setStep(3);
    } else if (step === 3) {
      handleSignup();
    }
  };

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

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      // First, create the user account
      const authResponse = await apiClient.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: 'USER',
      });

      if (authResponse.data) {
        // Store JWT token and user data
        localStorage.setItem('access_token', authResponse.data.access_token);
        localStorage.setItem('user', JSON.stringify(authResponse.data.user));

        // Create driver profile with documents
        const user = authResponse.data.user;
        
        await apiClient.post('/drivers', {
          userId: user.userId,
          licenseNumber: formData.licenseNumber,
          licenseDocument: formData.licenseDocument,
          vehicleDocument: formData.vehicleDocument,
          isVerified: false, // Will be verified by admin
        });

        // Create vehicle entry
        await apiClient.post('/vehicles', {
          userId: user.userId,
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          year: parseInt(formData.vehicleYear),
          color: formData.vehicleColor,
          plateNumber: formData.vehiclePlateNumber,
          vehicleDocument: formData.vehicleDocument,
          isActive: false, // Activated after admin verification
        });

        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = formData.password.length >= 8 && 
                          /[A-Z]/.test(formData.password) && 
                          /[0-9]/.test(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <IconButton
          icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
          onClick={() => {
            if (step === 1) {
              router.push('/signup');
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
            Share rides, earn rewards
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
            <div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-[#dc143c]' : 'bg-white/10'}`} />
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-white">Personal Information</h2>
              
              <Input
                type="text"
                label="Full Name"
                placeholder="Ahmed Ali"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                icon={<User className="w-5 h-5" />}
              />

              <Input
                type="email"
                label="Email"
                placeholder="your.email@aubh.edu.bh"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                icon={<Mail className="w-5 h-5" />}
              />

              <Input
                type="tel"
                label="Phone Number"
                placeholder="+973 XXXX XXXX or 17001234"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                icon={<Phone className="w-5 h-5" />}
              />
            </div>
          )}

          {/* Step 2: Security */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-white">Create Password</h2>
              
              <Input
                type="password"
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                icon={<Lock className="w-5 h-5" />}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                icon={<Lock className="w-5 h-5" />}
                error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
              />

              <div className="bg-white/5 border-2 border-white/10 rounded-[18px] p-4">
                <p className="text-sm text-[#99a1af] mb-2">Password must contain:</p>
                <ul className="text-sm text-[#99a1af] space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={formData.password.length >= 8 ? 'text-green-500' : ''}>●</span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>●</span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/[0-9]/.test(formData.password) ? 'text-green-500' : ''}>●</span>
                    One number
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Vehicle Info */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-white">Vehicle & License Information</h2>
              
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
                    <span className="text-[#99a1af] flex-1">
                      {licenseFileName || 'Upload license document (JPEG, PNG, PDF)'}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-[#99a1af] mt-1">Max file size: 5MB</p>
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

              <Input
                type="number"
                label="Vehicle Year"
                placeholder="2020"
                value={formData.vehicleYear}
                onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                required
                icon={<Hash className="w-5 h-5" />}
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

              <div>
                <label className="block text-sm font-medium text-[#d1d5dc] mb-3">
                  Vehicle Document *
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
                    <span className="text-[#99a1af] flex-1">
                      {vehicleFileName || 'Upload vehicle registration (JPEG, PNG, PDF)'}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-[#99a1af] mt-1">Max file size: 5MB</p>
              </div>

              <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-[18px] p-4">
                <p className="text-sm text-blue-400">
                  Your documents will be reviewed by our admin team. You&apos;ll be able to offer rides once verified.
                </p>
              </div>
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
              (step === 2 && (!isPasswordValid || formData.password !== formData.confirmPassword)) ||
              (step === 3 && (!formData.licenseNumber || !formData.licenseDocument || 
                !formData.vehicleMake || !formData.vehicleModel || !formData.vehicleYear ||
                !formData.vehicleColor || !formData.vehiclePlateNumber || !formData.vehicleDocument))
            }
          >
            {loading ? 'Creating Account...' : step === 3 ? 'Complete Registration' : 'Continue'}
          </Button>

          <div className="text-center">
            <span className="text-[#99a1af]">Already have an account? </span>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-[#dc143c] font-medium hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
