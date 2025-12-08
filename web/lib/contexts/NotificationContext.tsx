'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface Notification {
  notificationId: number;
  userId: number;
  type: 'BOOKING_REQUEST' | 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'RIDE_STARTED' | 'RIDE_COMPLETED' | 'DRIVER_VERIFIED' | 'SYSTEM';
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    show: boolean;
  }>({ title: '', message: '', type: 'info', show: false });

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/notifications');
      setNotifications(response.data);
      
      // Update unread count
      const unread = response.data.filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.put('/notifications/read-all');
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  const showToast = useCallback((
    title: string,
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info'
  ) => {
    setToast({ title, message, type, show: true });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        showToast,
      }}
    >
      {children}
      
      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 9999,
            maxWidth: '400px',
            width: '90%',
          }}
        >
          <div
            style={{
              background: '#101828',
              border: `2px solid ${
                toast.type === 'error' ? '#DC143C' :
                toast.type === 'success' ? '#10B981' :
                toast.type === 'warning' ? '#F59E0B' :
                'rgba(255, 255, 255, 0.1)'
              }`,
              borderRadius: '18px',
              padding: '18px',
              boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>
                {toast.type === 'error' && '❌'}
                {toast.type === 'success' && '✅'}
                {toast.type === 'warning' && '⚠️'}
                {toast.type === 'info' && 'ℹ️'}
              </div>
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: 0,
                    marginBottom: '4px',
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {toast.title}
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: '#99A1AF',
                    fontSize: '16px',
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: '24px',
                  }}
                >
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#99A1AF',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
