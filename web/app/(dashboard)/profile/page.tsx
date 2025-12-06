'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ChevronLeft, MoreVertical, ChevronRight, User, Car, List, CreditCard, HelpCircle, Settings } from 'lucide-react';

interface User {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  accountStatus: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-24">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <IconButton
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-medium text-white">Profile</h1>
          <IconButton
            icon={<MoreVertical className="w-6 h-6 text-slate-300" />}
            onClick={() => {}}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card variant="default">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-b from-[#dc143c] to-[#8b0000] rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-medium text-white">{user.name}</h2>
              <p className="text-[#99a1af]">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-[#dc143c]/20 border border-[#dc143c] text-[#dc143c] rounded-full text-xs">
                  {user.role}
                </span>
                <span className="px-3 py-1 bg-[#10b981]/20 border border-[#10b981] text-[#10b981] rounded-full text-xs">
                  {user.accountStatus}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="glass">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-[#99a1af]">Total Rides</p>
            </div>
          </Card>
          <Card variant="glass">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0.0</p>
              <p className="text-sm text-[#99a1af]">Rating</p>
            </div>
          </Card>
          <Card variant="glass">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-[#99a1af]">Reviews</p>
            </div>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-[#dc143c]" />
                <span className="text-white">Edit Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#99a1af]" />
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-[#dc143c]" />
                <span className="text-white">My Vehicles</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#99a1af]" />
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <List className="w-6 h-6 text-[#dc143c]" />
                <span className="text-white">Ride History</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#99a1af]" />
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#dc143c]" />
                <span className="text-white">Payment Methods</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#99a1af]" />
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-[#dc143c]" />
                <span className="text-white">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#99a1af]" />
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-[#dc143c]" />
                <span className="text-white">Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#99a1af]" />
            </div>
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={handleLogout}
        >
          Logout
        </Button>

        {/* App Version */}
        <p className="text-center text-sm text-[#6a7282]">
          CarShare v1.0.0 • AUBH
        </p>
      </div>
    </div>
  );
}
