'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, MessageCircle, DollarSign, Car, Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { notificationsApi } = await import('@/lib/api');
        const data = await notificationsApi.getMyNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'MATCH':
      case 'BOOKING_REQUEST':
      case 'BOOKING_CONFIRMED':
        return <Car className="w-6 h-6 text-[#DC143C]" />;
      case 'PAYMENT':
        return <DollarSign className="w-6 h-6 text-green-400" />;
      case 'MESSAGE':
        return <MessageCircle className="w-6 h-6 text-blue-400" />;
      default:
        return <Bell className="w-6 h-6 text-[#99A1AF]" />;
    }
  };

  const markAllAsRead = async () => {
    try {
      const { notificationsApi } = await import('@/lib/api');
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#DC143C] animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-[#6A7282] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
            <p className="text-[#99A1AF]">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const timeAgo = (dateString: string) => {
              const date = new Date(dateString);
              const now = new Date();
              const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
              
              if (seconds < 60) return 'Just now';
              if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
              if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
              if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
              return date.toLocaleDateString();
            };

            return (
              <div
                key={notification.notificationId}
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
                    <p className="text-[#6A7282] text-xs">{timeAgo(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-[#DC143C] rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
