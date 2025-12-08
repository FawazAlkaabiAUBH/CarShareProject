'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
      });

      const { access_token, user } = response.data;
      login(user, access_token);
      
      // Redirect to role selection
      router.push('/role-selection');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29] pt-[27px] pb-[36px] px-[27px] relative">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center mb-[27px]"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-[27px]">
          <div className="w-[108px] h-[108px] bg-gradient-to-b from-[#002D72] to-[#DC143C] rounded-[27px] shadow-2xl flex items-center justify-center">
            <div className="text-white text-[25px] font-normal leading-[30px] text-center">
              A
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-[9px]">
          <h1 className="text-2xl font-medium leading-9 tracking-[0.07px] text-white text-center">
            Welcome Back
          </h1>
          <p className="text-lg leading-[27px] tracking-[-0.44px] text-[#99A1AF] text-center">
            Sign in to continue to AUBH RideShare
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-[#101828] rounded-t-[45px] shadow-2xl px-[27px] pt-[36px] -mt-[9px]">
        <form onSubmit={handleSubmit} className="space-y-[27px]">
          {/* Email/Phone Input */}
          <div className="space-y-[9px]">
            <label className="text-lg leading-[18px] tracking-[-0.44px] text-[#D1D5DC] font-medium">
              AUBH Email or Phone
            </label>
            <Input
              type="text"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
              placeholder="student@aubh.edu.bh"
              className="w-full h-[63px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-[13.5px] py-[4.5px] text-lg text-white placeholder:text-white/60"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-[9px]">
            <label className="text-lg leading-[18px] tracking-[-0.44px] text-[#D1D5DC] font-medium">
              Password
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full h-[63px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-[13.5px] py-[4.5px] text-lg text-white placeholder:text-white/60"
              required
            />
            
            {/* Forgot Password */}
            <button
              type="button"
              onClick={() => alert('Password reset functionality coming soon')}
              className="text-lg leading-[27px] tracking-[-0.44px] text-[#DC143C] mt-[13.5px]"
            >
              Forgot Password?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[18px] text-red-500 text-sm">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Bottom Actions */}
      <div className="bg-[#101828] px-[27px] pb-[27px] space-y-[18px]">
        <Button
          variant="primary"
          className="w-full !bg-white !text-[#1A1D29] hover:!bg-white/90"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <p className="text-lg leading-[27px] tracking-[-0.44px] text-[#99A1AF] text-center">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="text-[#DC143C] font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}
