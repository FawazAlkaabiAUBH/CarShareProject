'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Shield, Edit2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    rating: 0,
    verified: false,
  });

  useEffect(() => {
    // TODO: Fetch user stats
    setStats({
      totalRides: 47,
      rating: 4.8,
      verified: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <button
          onClick={() => router.back()}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>

        <h1 className="text-2xl font-medium text-white">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-6 pb-8">
        <div className="bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[27px] p-6 mb-6">
          {/* Avatar and Name */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center">
              <span className="text-3xl font-semibold text-white">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-white">{user?.name || 'Ahmed Hassan'}</h2>
                <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4 text-[#99A1AF]" />
                </button>
              </div>
              <p className="text-[#99A1AF] mb-2">{user?.role || 'Driver'}</p>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{stats.rating.toFixed(1)}</span>
                {stats.verified && (
                  <>
                    <span className="text-[#99A1AF]">•</span>
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-[18px]">
              <div className="text-2xl font-bold text-white mb-1">{stats.totalRides}</div>
              <div className="text-xs text-[#99A1AF]">Total Rides</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-[18px]">
              <div className="text-2xl font-bold text-white mb-1">{stats.rating.toFixed(1)}</div>
              <div className="text-xs text-[#99A1AF]">Rating</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-[18px]">
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-xs text-[#99A1AF]">Completion</div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            
            <div>
              <label className="text-sm text-[#99A1AF]">AUBH ID</label>
              <p className="text-white">{user?.aubhId || '20230001'}</p>
            </div>
            
            <div>
              <label className="text-sm text-[#99A1AF]">Gender</label>
              <p className="text-white">{user?.gender || 'Male'}</p>
            </div>
            
            <div>
              <label className="text-sm text-[#99A1AF]">Email</label>
              <p className="text-white">{user?.email || 'student@aubh.edu.bh'}</p>
            </div>
            
            <div>
              <label className="text-sm text-[#99A1AF]">Phone</label>
              <p className="text-white">{user?.phoneNumber || '+973 XXXX XXXX'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}
