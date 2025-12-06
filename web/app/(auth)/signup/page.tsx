'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'RIDER' as 'DRIVER' | 'RIDER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (step === 1 && formData.email && formData.name) {
      setStep(2);
    } else if (step === 2 && formData.password === formData.confirmPassword) {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/users', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        accountStatus: 'ACTIVE',
      });

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        router.push('/verification');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <IconButton
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#d1d5dc" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          onClick={() => step === 1 ? router.back() : setStep(1)}
        />
      </div>

      {/* Logo Section */}
      <div className="flex-shrink-0 flex flex-col items-center pt-12 pb-8">
        <div className="w-[108px] h-[108px] bg-gradient-to-b from-[#002d72] to-[#dc143c] rounded-[27px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-center justify-center mb-8">
          <span className="text-white text-[25.2px] font-normal">A</span>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-lg text-[#99a1af] tracking-tight">
            Join AUBH RideShare Community
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

          {step === 1 && (
            <div className="space-y-6">
              <Input
                type="text"
                label="Full Name"
                placeholder="Ahmed Ali"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 18a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              />

              <Input
                type="email"
                label="Email"
                placeholder="your.email@aubh.edu.bh"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              />

              <Input
                type="tel"
                label="Phone Number"
                placeholder="+973 XXXX XXXX"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5a2 2 0 012-2h1.586a1 1 0 01.707.293l1.5 1.5a1 1 0 01.293.707V7a1 1 0 01-.293.707l-1 1A9.953 9.953 0 0010.707 12l1-1A1 1 0 0112.414 11h1.586a1 1 0 01.707.293l1.5 1.5a1 1 0 01.293.707V15a2 2 0 01-2 2h-1C7.82 17 3 12.18 3 7V5z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              />

              <div>
                <label className="block text-sm font-medium text-[#d1d5dc] mb-3">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'RIDER' })}
                    className={`p-4 rounded-[18px] border-2 transition-all ${
                      formData.role === 'RIDER'
                        ? 'bg-[#dc143c]/20 border-[#dc143c]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <p className="text-white font-medium">Find Rides</p>
                    <p className="text-sm text-[#99a1af] mt-1">As a Rider</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'DRIVER' })}
                    className={`p-4 rounded-[18px] border-2 transition-all ${
                      formData.role === 'DRIVER'
                        ? 'bg-[#dc143c]/20 border-[#dc143c]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <p className="text-white font-medium">Offer Rides</p>
                    <p className="text-sm text-[#99a1af] mt-1">As a Driver</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Input
                type="password"
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <rect x="5" y="9" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 9V6a3 3 0 116 0v3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <rect x="5" y="9" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 9V6a3 3 0 116 0v3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
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
            disabled={loading}
          >
            {loading ? 'Creating Account...' : step === 1 ? 'Continue' : 'Create Account'}
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
