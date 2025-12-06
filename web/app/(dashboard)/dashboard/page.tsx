'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { User, Search, PlusCircle, Calendar, Home, Car, Bell } from 'lucide-react';

interface User {
  userId: number;
  name: string;
  email: string;
  role: 'DRIVER' | 'RIDER' | 'ADMIN';
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] p-6">
      {/* Header */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#99a1af] text-sm">Welcome back,</p>
            <h1 className="text-2xl font-medium text-white">{user.name}</h1>
          </div>
          <IconButton
            icon={<User className="w-6 h-6 text-slate-300" />}
            onClick={() => router.push('/profile')}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card
            variant="glass"
            className="cursor-pointer hover:bg-white/10"
            onClick={() => router.push('/find-ride')}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-b from-[#dc143c] to-[#8b0000] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-white font-medium">Find a Ride</p>
              <p className="text-sm text-[#99a1af] mt-1">Search available rides</p>
            </div>
          </Card>

          <Card
            variant="glass"
            className="cursor-pointer hover:bg-white/10"
            onClick={() => router.push('/offer-ride')}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-b from-[#002d72] to-[#dc143c] rounded-full flex items-center justify-center mb-4">
                <PlusCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-white font-medium">Offer a Ride</p>
              <p className="text-sm text-[#99a1af] mt-1">Share your journey</p>
            </div>
          </Card>
        </div>

        {/* My Bookings */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-white mb-4">My Bookings</h2>
          <Card variant="default">
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-[#6a7282]" />
              <p className="text-[#99a1af]">No active bookings</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => router.push('/find-ride')}
              >
                Find a Ride
              </Button>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="glass">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-sm text-[#99a1af]">Rides</p>
          </Card>
          <Card variant="glass">
            <p className="text-2xl font-bold text-white">0.0</p>
            <p className="text-sm text-[#99a1af]">Rating</p>
          </Card>
          <Card variant="glass">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-sm text-[#99a1af]">Saved</p>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#101828] border-t-2 border-white/10 p-4">
          <div className="max-w-md mx-auto flex justify-around">
            <button className="flex flex-col items-center gap-1">
              <Home className="w-6 h-6 text-[#dc143c]" />
              <span className="text-xs text-[#dc143c]">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1" onClick={() => router.push('/rides')}>
              <Car className="w-6 h-6 text-[#99a1af]" />
              <span className="text-xs text-[#99a1af]">Rides</span>
            </button>
            <button className="flex flex-col items-center gap-1" onClick={() => router.push('/notifications')}>
              <Bell className="w-6 h-6 text-[#99a1af]" />
              <span className="text-xs text-[#99a1af]">Alerts</span>
            </button>
            <button className="flex flex-col items-center gap-1" onClick={() => router.push('/profile')}>
              <User className="w-6 h-6 text-[#99a1af]" />
              <span className="text-xs text-[#99a1af]">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
