'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gender: 'MALE' as 'MALE' | 'FEMALE',
    aubhId: '',
    email: '',
    name: '',
    phoneNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Register user
      await apiClient.post('/auth/register', formData);
      
      // Navigate to verification with email/phone
      router.push(`/verification?contact=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-[27px] pt-[27px] pb-[18px]">
        <button
          onClick={() => router.push('/login')}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>
      </div>

      {/* Title Section */}
      <div className="px-[27px] pb-[18px] space-y-[9px]">
        <h1 className="text-2xl font-medium leading-9 tracking-[0.07px] text-white">
          Create Account
        </h1>
        <p className="text-lg leading-[27px] tracking-[-0.44px] text-[#99A1AF]">
          Join AUBH RideShare community
        </p>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-[#101828] rounded-t-[45px] shadow-2xl px-[27px] pt-[27px] pb-[27px] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-[22.5px]">
          {/* Gender Selector */}
          <div className="space-y-[13.5px]">
            <label className="text-lg leading-[18px] tracking-[-0.44px] text-[#D1D5DC] font-medium">
              Gender
            </label>
            <div className="flex gap-[13.5px]">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'MALE' })}
                className={`flex-1 h-[54px] rounded-[18px] text-lg font-medium transition-all ${
                  formData.gender === 'MALE'
                    ? 'bg-[#DC143C] text-white'
                    : 'bg-[#1E2939] border-2 border-[#364153] text-[#D1D5DC]'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'FEMALE' })}
                className={`flex-1 h-[54px] rounded-[18px] text-lg font-medium transition-all ${
                  formData.gender === 'FEMALE'
                    ? 'bg-[#DC143C] text-white'
                    : 'bg-[#1E2939] border-2 border-[#364153] text-[#D1D5DC]'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* AUBH ID */}
          <div className="space-y-[9px]">
            <label className="text-lg leading-[18px] tracking-[-0.44px] text-[#D1D5DC] font-medium">
              AUBH ID
            </label>
            <Input
              type="text"
              value={formData.aubhId}
              onChange={(e) => setFormData({ ...formData, aubhId: e.target.value })}
              placeholder="Enter your AUBH ID"
              className="w-full h-[63px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-[13.5px] text-lg text-white placeholder:text-white/60"
              required
            />
          </div>

          {/* AUBH Email */}
          <div className="space-y-[9px]">
            <label className="text-lg leading-[18px] tracking-[-0.44px] text-[#D1D5DC] font-medium">
              AUBH Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="student@aubh.edu.bh"
              className="w-full h-[63px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-[13.5px] text-lg text-white placeholder:text-white/60"
              required
            />
          </div>

          {/* Full Name */}
          <div className="space-y-[9px]">
            <label className="text-lg leading-[18px] tracking-[-0.44px] text-[#D1D5DC] font-medium">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              className="w-full h-[63px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-[13.5px] text-lg text-white placeholder:text-white/60"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-[9px]">
            <label className="text-lg leading-[18px] tracking-[-0.44px] text-[#D1D5DC] font-medium">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+973 XXXX XXXX"
              className="w-full h-[63px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-[13.5px] text-lg text-white placeholder:text-white/60"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-[9px]">
            <label className="text-lg leading-[18px] tracking-[-0.44px] text-[#D1D5DC] font-medium">
              Password
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a strong password"
              className="w-full h-[63px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-[13.5px] text-lg text-white placeholder:text-white/60"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[18px] text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full !bg-white !text-[#1A1D29] hover:!bg-white/90"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          {/* Login Link */}
          <p className="text-lg leading-[27px] tracking-[-0.44px] text-[#99A1AF] text-center">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-[#DC143C] font-medium"
            >
              Login
            </button>
          </p>
        </form>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}
