'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { ChevronLeft, Bell } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'booking',
    title: 'New Booking Request',
    message: 'Ahmed Ali wants to book a seat for tomorrow',
    time: '2 minutes ago',
    read: false,
    icon: '🚗',
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    message: 'You received 5.00 BD for your ride',
    time: '1 hour ago',
    read: false,
    icon: '💰',
  },
  {
    id: 3,
    type: 'ride',
    title: 'Ride Starting Soon',
    message: 'Your ride to AUBH starts in 30 minutes',
    time: '2 hours ago',
    read: true,
    icon: '⏰',
  },
  {
    id: 4,
    type: 'review',
    title: 'New Review',
    message: 'Fatima Hassan left you a 5-star review',
    time: '1 day ago',
    read: true,
    icon: '⭐',
  },
];

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-24">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <IconButton
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-medium text-white">Notifications</h1>
          <button className="text-sm text-[#dc143c] font-medium">
            Mark All Read
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-4">
        {notifications.length === 0 ? (
          <Card variant="glass">
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4 text-[#6a7282]" />
              <p className="text-[#99a1af]">No notifications yet</p>
              <p className="text-sm text-[#6a7282] mt-2">We'll notify you when something happens</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Today */}
            <div>
              <h2 className="text-sm font-medium text-[#99a1af] mb-3">Today</h2>
              <div className="space-y-3">
                {notifications.filter((n) => !n.read).map((notification) => (
                  <Card
                    key={notification.id}
                    variant="glass"
                    className="cursor-pointer hover:bg-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#dc143c]/20 border-2 border-[#dc143c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-[#99a1af] mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[#6a7282]">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#dc143c] rounded-full mt-2" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Earlier */}
            <div>
              <h2 className="text-sm font-medium text-[#99a1af] mb-3">Earlier</h2>
              <div className="space-y-3">
                {notifications.filter((n) => n.read).map((notification) => (
                  <Card
                    key={notification.id}
                    variant="glass"
                    className="cursor-pointer hover:bg-white/10 opacity-60"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/5 border-2 border-white/10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-[#99a1af] mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[#6a7282]">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
