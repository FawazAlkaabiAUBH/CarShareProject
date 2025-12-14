import { apiClient } from '../api';
import { Notification } from '../types';

export const notificationsApi = {
  // Get all my notifications
  async getMyNotifications(): Promise<Notification[]> {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  // Get unread notifications
  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await apiClient.get('/notifications/unread');
    return response.data;
  },

  // Get unread count
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/notifications/unread/count');
    return response.data;
  },

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await apiClient.put('/notifications/read-all');
  },
};
