'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Car, ShieldCheck, Users, Leaf } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#2a1a1a] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(191.53%_51.8%_at_50%_50%,#ffffff_0.23%,rgba(0,0,0,0)_0%)] opacity-5 pointer-events-none" />
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12 relative z-10">
          <div className="relative mb-8">
            {/* Glow Effect */}
            <div className="absolute -inset-6 bg-[#dc143c]/30 rounded-full blur-[64px]" />
            
            {/* Logo Circle */}
            <div className="relative w-[180px] h-[180px] bg-gradient-to-b from-[#dc143c] to-[#8b0000] rounded-full border-4 border-white/10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <Car className="w-[108px] h-[108px] text-white" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Text Content */}
          <div className="text-center space-y-3">
            <h1 className="text-[60px] font-normal leading-none text-white tracking-tight">
              CarShare
            </h1>
            <p className="text-lg text-[#d1d5dc] font-normal tracking-tight">
              American University of Bahrain
            </p>
            <p className="text-lg text-[#6a7282] font-normal tracking-tight">
              Your Campus Carpooling Solution
            </p>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          <div className="bg-white/5 border-2 border-white/10 rounded-[18px] p-5 text-center">
            <div className="w-9 h-9 mx-auto mb-3">
              <ShieldCheck className="w-9 h-9 text-crimson" strokeWidth={2} />
            </div>
            <p className="text-lg text-[#d1d5dc]">Verified</p>
          </div>
          
          <div className="bg-white/5 border-2 border-white/10 rounded-[18px] p-5 text-center">
            <div className="w-9 h-9 mx-auto mb-3">
              <Users className="w-9 h-9 text-crimson" strokeWidth={2} />
            </div>
            <p className="text-lg text-[#d1d5dc]">Students</p>
          </div>
          
          <div className="bg-white/5 border-2 border-white/10 rounded-[18px] p-5 text-center">
            <div className="w-9 h-9 mx-auto mb-3">
              <Leaf className="w-9 h-9 text-crimson" strokeWidth={2} />
            </div>
            <p className="text-lg text-[#d1d5dc] leading-6">Eco-Friendly</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-[18px]">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => router.push('/signup')}
          >
            Get Started
          </Button>
          
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
          
          <p className="text-center text-lg text-[#6a7282] tracking-tight">
            Made for AUBH Students
          </p>
        </div>
      </div>
    </div>
  );
}
