'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@/components/ui/IconButton';
import { useNotifications } from '@/lib/contexts/NotificationContext';
import { ChevronLeft } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, loading } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_REQUEST':
        return '📬';
      case 'BOOKING_CONFIRMED':
        return '✅';
      case 'BOOKING_CANCELLED':
        return '❌';
      case 'RIDE_STARTED':
        return '🚗';
      case 'RIDE_COMPLETED':
        return '🏁';
      case 'DRIVER_VERIFIED':
        return '✓';
      case 'SYSTEM':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.notificationId);
    }

    // Navigate if there's a related entity
    if (notification.relatedEntityType && notification.relatedEntityId) {
      if (notification.relatedEntityType === 'booking') {
        router.push(`/booking/${notification.relatedEntityId}`);
      } else if (notification.relatedEntityType === 'ride') {
        router.push(`/ride/${notification.relatedEntityId}`);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  const handleMarkAllAsRead = async () => {
    if (unreadCount > 0) {
      await markAllAsRead();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-[#99a1af]">Loading notifications...</div>
      </div>
    );
  }

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
          <button 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-sm text-[#dc143c] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-[18px] p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-[#99a1af]">No notifications yet</p>
              <p className="text-sm text-[#6a7282] mt-2">We'll notify you when something happens</p>
            </div>
          </div>
        ) : (
          <>
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-[#99a1af] mb-3">Unread</h2>
                <div className="space-y-3">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      onClick={() => handleNotificationClick(notification)}
                      className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-[18px] p-6 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#dc143c]/20 border-2 border-[#dc143c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-[#99a1af] mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#6a7282]">
                            {getTimeSince(notification.createdAt)}
                          </p>
                        </div>
                        <div className="w-2 h-2 bg-[#dc143c] rounded-full mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-[#99a1af] mb-3">Earlier</h2>
                <div className="space-y-3">
                  {readNotifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      onClick={() => handleNotificationClick(notification)}
                      className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-[18px] p-6 cursor-pointer hover:bg-white/10 opacity-60 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/5 border-2 border-white/10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-[#99a1af] mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#6a7282]">
                            {getTimeSince(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
