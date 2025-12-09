'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react';

const MOCK_RIDES = [
  {
    id: 1,
    from: 'AUBH Campus',
    to: 'City Centre Mall',
    date: '2024-12-07',
    time: '14:30',
    otherPerson: 'Ahmed Ali',
    price: 'BHD 5.50',
    status: 'COMPLETED',
  },
  {
    id: 2,
    from: 'Riffa',
    to: 'AUBH Campus',
    date: '2024-12-06',
    time: '08:00',
    otherPerson: 'Sara Ahmed',
    price: 'BHD 4.00',
    status: 'COMPLETED',
  },
  {
    id: 3,
    from: 'AUBH Campus',
    to: 'Manama',
    date: '2024-12-05',
    time: '16:00',
    otherPerson: 'Mohammed Ali',
    price: 'BHD 6.50',
    status: 'CANCELLED',
  },
];

export default function RideHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'completed' | 'cancelled'>('completed');
  const [stats] = useState({
    totalRides: 47,
    thisMonth: 12,
    totalSpent: '245.00',
  });

  const filteredRides = MOCK_RIDES.filter(ride => 
    activeTab === 'completed' ? ride.status === 'COMPLETED' : ride.status === 'CANCELLED'
  );

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

        <h1 className="text-2xl font-medium text-white mb-6">Ride History</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px]">
            <div className="text-2xl font-bold text-white mb-1">{stats.totalRides}</div>
            <div className="text-xs text-[#99A1AF]">Total Rides</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px]">
            <div className="text-2xl font-bold text-white mb-1">{stats.thisMonth}</div>
            <div className="text-xs text-[#99A1AF]">This Month</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px]">
            <div className="text-lg font-bold text-white mb-1">BHD {stats.totalSpent}</div>
            <div className="text-xs text-[#99A1AF]">Total</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 h-[48px] rounded-[18px] font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-[#DC143C] text-white'
                : 'bg-[#1E2939] border-2 border-[#364153] text-[#D1D5DC]'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`flex-1 h-[48px] rounded-[18px] font-medium transition-all ${
              activeTab === 'cancelled'
                ? 'bg-[#DC143C] text-white'
                : 'bg-[#1E2939] border-2 border-[#364153] text-[#D1D5DC]'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Ride List */}
      <div className="px-6 pb-8 space-y-4">
        {filteredRides.map((ride) => (
          <div
            key={ride.id}
            className="bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px] p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-[#DC143C]" />
                  <span className="text-white font-medium">{ride.from}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">{ride.to}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#99A1AF]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{ride.date}</span>
                  </div>
                  <span>{ride.time}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white font-semibold mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{ride.price}</span>
                </div>
                <span className="text-sm text-[#99A1AF]">{ride.otherPerson}</span>
              </div>
            </div>
            <button className="w-full py-2 bg-white/5 rounded-lg text-sm text-[#DC143C] hover:bg-white/10 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
