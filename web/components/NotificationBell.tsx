'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/lib/contexts/NotificationContext';
import { useRouter } from 'next/navigation';
import { colors, borderRadius, spacing, shadows, typography } from '@/lib/design-tokens';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

    setIsOpen(false);
  };

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

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          width: '45px',
          height: '45px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: `2px solid ${colors.border.light}`,
          borderRadius: borderRadius.full,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: shadows.sm,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = colors.border.light;
        }}
      >
        <Bell className="w-5 h-5 text-[#d1d5dc]" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              minWidth: '20px',
              height: '20px',
              background: colors.primaryGradient,
              borderRadius: borderRadius.full,
              border: '2px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              fontFamily: typography.fontFamily,
              padding: '0 4px',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '55px',
            right: 0,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '500px',
            background: colors.background.secondary,
            border: `2px solid ${colors.border.default}`,
            borderRadius: borderRadius.lg,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: spacing.lg,
              borderBottom: `2px solid ${colors.border.default}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: typography.fontFamily,
                fontSize: typography.size.base,
                fontWeight: typography.weight.medium,
                color: colors.text.primary,
              }}
            >
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.primary,
                  fontSize: '14px',
                  fontFamily: typography.fontFamily,
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: spacing.xl,
                  textAlign: 'center',
                  color: colors.text.tertiary,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.size.base,
                }}
              >
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: spacing.lg,
                    borderBottom: `1px solid ${colors.border.default}`,
                    cursor: notification.relatedEntityId ? 'pointer' : 'default',
                    background: notification.isRead
                      ? 'transparent'
                      : 'rgba(220, 20, 60, 0.05)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (notification.relatedEntityId) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.isRead
                      ? 'transparent'
                      : 'rgba(220, 20, 60, 0.05)';
                  }}
                >
                  <div style={{ display: 'flex', gap: spacing.md, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '24px', lineHeight: 1 }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px',
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontFamily: typography.fontFamily,
                            fontSize: typography.size.base,
                            fontWeight: typography.weight.medium,
                            color: colors.text.primary,
                            lineHeight: typography.lineHeight.tight,
                          }}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: colors.primary,
                              flexShrink: 0,
                              marginLeft: spacing.sm,
                            }}
                          />
                        )}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          marginBottom: '4px',
                          fontFamily: typography.fontFamily,
                          fontSize: '14px',
                          color: colors.text.tertiary,
                          lineHeight: '20px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {notification.message}
                      </p>
                      <span
                        style={{
                          fontFamily: typography.fontFamily,
                          fontSize: '12px',
                          color: colors.text.muted,
                        }}
                      >
                        {getTimeSince(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: spacing.md,
                borderTop: `2px solid ${colors.border.default}`,
                textAlign: 'center',
              }}
            >
              <button
                onClick={() => {
                  router.push('/notifications');
                  setIsOpen(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.primary,
                  fontSize: typography.size.base,
                  fontFamily: typography.fontFamily,
                  fontWeight: typography.weight.medium,
                  cursor: 'pointer',
                  padding: spacing.sm,
                }}
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
