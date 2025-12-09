'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Car, Calendar, History, Shield, MessageCircle, User, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DriverDashboard() {
  const router = useRouter();
  const { user, setRole } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    thisWeek: 0,
    earned: '0.00',
    rating: 0,
  });

  useEffect(() => {
    // TODO: Fetch driver stats from API
    setStats({
      totalRides: 47,
      thisWeek: 3,
      earned: '125.50',
      rating: 4.9,
    });
  }, []);

  const quickActions = [
    { icon: Car, label: 'Post Ride', route: '/driver/post-ride', color: 'from-[#DC143C] to-[#8B0000]' },
    { icon: Calendar, label: 'Schedule', route: '/scheduled-rides', color: 'from-blue-600 to-blue-800' },
    { icon: History, label: 'History', route: '/ride-history', color: 'from-purple-600 to-purple-800' },
    { icon: Shield, label: 'Safety', route: '/safety', color: 'from-green-600 to-green-800' },
    { icon: MessageCircle, label: 'Chat', route: '/chat', color: 'from-orange-600 to-orange-800' },
    { icon: User, label: 'Profile', route: '/profile', color: 'from-gray-600 to-gray-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#1A1D29] to-[#0F0A1A] pb-8">
      {/* Header */}
      <div className="px-6 pt-16 pb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-white">AUBH Carpool</h1>
          <button
            onClick={() => {
              setRole('RIDER');
              router.push('/dashboard/rider');
            }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white hover:bg-white/20 transition-colors"
          >
            Switch to Rider
          </button>
        </div>
        <p className="text-[#DC143C] font-medium">Driver Mode</p>
      </div>

      {/* Driver Stats Card */}
      <div className="mx-6 mb-6 p-6 bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[27px] shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center">
            <span className="text-2xl font-semibold text-white">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-1">
              {user?.name || 'Fawaz Alkaabi'}
            </h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">{stats.rating.toFixed(1)}</span>
              <span className="text-[#99A1AF] text-sm ml-2">Verified Driver</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-[18px]">
            <div className="text-2xl font-bold text-white mb-1">{stats.totalRides}</div>
            <div className="text-xs text-[#99A1AF]">Total Rides</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-[18px]">
            <div className="text-2xl font-bold text-white mb-1">{stats.thisWeek}</div>
            <div className="text-xs text-[#99A1AF]">This Week</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-[18px]">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <div className="text-2xl font-bold text-white">BHD {stats.earned}</div>
            </div>
            <div className="text-xs text-[#99A1AF]">Earned</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => router.push(action.route)}
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px] hover:border-[#DC143C]/50 transition-all"
            >
              <div className={`w-12 h-12 bg-gradient-to-b ${action.color} rounded-[12px] flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <span className="text-sm text-white text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Car Registration CTA (if no car) */}
      <div className="mx-6 mt-6 p-4 bg-[#DC143C]/10 border border-[#DC143C]/30 rounded-[18px]">
        <p className="text-white text-sm mb-2">Complete your driver profile</p>
        <button
          onClick={() => router.push('/driver/car-registration')}
          className="text-[#DC143C] font-medium text-sm"
        >
          Register Your Vehicle →
        </button>
      </div>
    </div>
  );
}
