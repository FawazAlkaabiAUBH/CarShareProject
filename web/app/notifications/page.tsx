'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, MessageCircle, DollarSign, Car } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'MATCH',
    title: 'New match found!',
    body: 'Ahmed Hassan is a great match for your ride to City Centre Mall',
    createdAt: '5 min ago',
    isRead: false,
    relatedRideId: 1,
  },
  {
    id: 2,
    type: 'PAYMENT',
    title: 'Payment received',
    body: 'You received BHD 5.50 for your ride',
    createdAt: '1 hour ago',
    isRead: false,
  },
  {
    id: 3,
    type: 'MESSAGE',
    title: 'New message',
    body: 'Sara Ahmed sent you a message',
    createdAt: '2 hours ago',
    isRead: true,
  },
  {
    id: 4,
    type: 'RIDE_COMPLETED',
    title: 'Ride completed',
    body: 'Your ride with Mohammed Ali has been completed',
    createdAt: '1 day ago',
    isRead: true,
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const getIcon = (type: string) => {
    switch (type) {
      case 'MATCH':
        return <Car className="w-6 h-6 text-[#DC143C]" />;
      case 'PAYMENT':
        return <DollarSign className="w-6 h-6 text-green-400" />;
      case 'MESSAGE':
        return <MessageCircle className="w-6 h-6 text-blue-400" />;
      default:
        return <Bell className="w-6 h-6 text-[#99A1AF]" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
          </button>

          <button
            onClick={markAllAsRead}
            className="text-[#DC143C] font-medium text-sm"
          >
            Mark all as read
          </button>
        </div>

        <h1 className="text-2xl font-medium text-white">Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className="px-6 pb-8 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-[18px] border transition-colors ${
              notification.isRead
                ? 'bg-gradient-to-br from-[#1E2939]/50 to-[#101828]/50 border-white/5'
                : 'bg-gradient-to-br from-[#1E2939] to-[#101828] border-[#DC143C]/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                <p className="text-[#99A1AF] text-sm mb-2">{notification.body}</p>
                <p className="text-[#6A7282] text-xs">{notification.createdAt}</p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-[#DC143C] rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
