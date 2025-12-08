'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ChevronLeft, Car, Info } from 'lucide-react';

export default function DriverSignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      // User is logged in, redirect to become-driver page
      router.push('/become-driver');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <IconButton
          icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
          onClick={() => router.push('/signup')}
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

      {/* Content Section */}
      <div className="flex-1 bg-[#101828] rounded-t-[45px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 pt-9">
        <div className="space-y-6 max-w-md mx-auto">
          <Card variant="glass" className="border-blue-500/20">
            <div className="flex gap-3">
              <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-400 font-medium mb-2">Account Required</p>
                <p className="text-sm text-[#99a1af]">
                  To become a driver, you need to have an account first. Please sign up as a regular user or log in to your existing account.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">What you&apos;ll need:</h2>
            <ul className="space-y-3 text-[#99a1af] text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#dc143c] mt-1">●</span>
                <span>Valid driver&apos;s license</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#dc143c] mt-1">●</span>
                <span>Vehicle information and registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#dc143c] mt-1">●</span>
                <span>Clear photos of your documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#dc143c] mt-1">●</span>
                <span>Admin approval (usually within 24 hours)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => router.push('/signup')}
            >
              Create Account
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              I Already Have an Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
