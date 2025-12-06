'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';

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
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-24">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <IconButton
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#d1d5dc" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-medium text-white">Profile</h1>
          <IconButton
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="1" fill="#d1d5dc" />
                <circle cx="12" cy="6" r="1" fill="#d1d5dc" />
                <circle cx="12" cy="18" r="1" fill="#d1d5dc" />
              </svg>
            }
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
                <svg className="w-6 h-6 text-[#dc143c]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 20a8 8 0 0116 0" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-white">Edit Profile</span>
              </div>
              <svg className="w-5 h-5 text-[#99a1af]" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#dc143c]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <circle cx="8" cy="16" r="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-white">My Vehicles</span>
              </div>
              <svg className="w-5 h-5 text-[#99a1af]" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#dc143c]" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7H4M20 12H4M20 17H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-white">Ride History</span>
              </div>
              <svg className="w-5 h-5 text-[#99a1af]" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#dc143c]" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-white">Payment Methods</span>
              </div>
              <svg className="w-5 h-5 text-[#99a1af]" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#dc143c]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-white">Help & Support</span>
              </div>
              <svg className="w-5 h-5 text-[#99a1af]" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </Card>

          <Card variant="glass" className="cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#dc143c]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-white">Settings</span>
              </div>
              <svg className="w-5 h-5 text-[#99a1af]" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
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
