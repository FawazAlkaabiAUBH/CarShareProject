'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Car, MapPin } from 'lucide-react';

export default function SignupChoicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex flex-col">
      {/* Logo Section */}
      <div className="flex-shrink-0 flex flex-col items-center pt-24 pb-12">
        <div className="w-[108px] h-[108px] bg-gradient-to-b from-[#002d72] to-[#dc143c] rounded-[27px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-center justify-center mb-8">
          <span className="text-white text-[25.2px] font-normal">A</span>
        </div>
        
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-3xl font-medium text-white tracking-tight">
            Welcome to AUBH RideShare
          </h1>
          <p className="text-lg text-[#99a1af] tracking-tight">
            Choose how you want to get started
          </p>
        </div>
      </div>

      {/* Options Section */}
      <div className="flex-1 bg-[#101828] rounded-t-[45px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 pt-12">
        <div className="space-y-6 max-w-md mx-auto">
          {/* Rider Option */}
          <div 
            onClick={() => router.push('/signup')}
            className="bg-white/5 border-2 border-white/10 hover:border-[#dc143c] rounded-[27px] p-8 cursor-pointer transition-all group"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#dc143c]/20 group-hover:bg-[#dc143c]/30 rounded-[18px] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-8 h-8 text-[#dc143c]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-medium text-white mb-2">I need a ride</h2>
                <p className="text-[#99a1af] leading-relaxed">
                  Find rides to AUBH campus or around Bahrain. Save money and travel with fellow students.
                </p>
                <div className="mt-4 text-[#dc143c] font-medium flex items-center gap-2">
                  Sign up as a Rider
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Option */}
          <div 
            onClick={() => router.push('/signup/driver')}
            className="bg-white/5 border-2 border-white/10 hover:border-[#dc143c] rounded-[27px] p-8 cursor-pointer transition-all group"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#dc143c]/20 group-hover:bg-[#dc143c]/30 rounded-[18px] flex items-center justify-center flex-shrink-0">
                <Car className="w-8 h-8 text-[#dc143c]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-medium text-white mb-2">I can offer rides</h2>
                <p className="text-[#99a1af] leading-relaxed">
                  Share your commute and earn rewards. Help fellow students while saving on fuel costs.
                </p>
                <div className="mt-4 text-[#dc143c] font-medium flex items-center gap-2">
                  Sign up as a Driver
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center pt-8">
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
