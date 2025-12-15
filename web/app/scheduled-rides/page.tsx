'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Repeat, Plus } from 'lucide-react';

const MOCK_SCHEDULED_RIDES = [
  {
    id: 1,
    from: 'AUBH Campus',
    to: 'City Centre Mall',
    date: '2024-12-10',
    time: '14:30',
    isRecurring: false,
    status: 'One-time',
  },
  {
    id: 2,
    from: 'Riffa',
    to: 'AUBH Campus',
    date: 'Mon-Wed-Fri',
    time: '08:00',
    isRecurring: true,
    status: 'Recurring',
  },
];

export default function ScheduledRidesPage() {
  const router = useRouter();
  const [rides] = useState(MOCK_SCHEDULED_RIDES);

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

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium text-white">Scheduled Rides</h1>
          <button
            onClick={() => router.push('/driver/post-ride')}
            className="w-[45px] h-[45px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-full flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Scheduled Rides List */}
      <div className="px-6 pb-8 space-y-4">
        {rides.length > 0 ? (
          rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px] p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#DC143C]" />
                    <span className="text-white font-medium">{ride.from}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
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
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  ride.isRecurring 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-white/10 text-[#99A1AF]'
                }`}>
                  {ride.isRecurring && <Repeat className="w-3 h-3" />}
                  {ride.status}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white/5 rounded-lg text-sm text-white hover:bg-white/10 transition-colors">
                  Edit
                </button>
                <button className="flex-1 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500 hover:bg-red-500/20 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-[#6A7282] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No scheduled rides</h3>
            <p className="text-[#99A1AF] mb-6">Create a recurring or one-time scheduled ride</p>
            <button
              onClick={() => router.push('/driver/post-ride')}
              className="px-6 py-3 bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-[18px] text-white font-medium"
            >
              Schedule a Ride
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
