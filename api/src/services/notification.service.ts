import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  /**
   * Create a notification for a user
   */
  async createNotification(data: {
    userId: number;
    type: Notification['type'];
    title: string;
    body: string;
    relatedRideId?: number;
    relatedUserId?: number;
  }): Promise<Notification> {
    const notification = this.notificationRepository.save({
      ...data,
      isRead: false,
      createdAt: new Date(),
    });

    // In a real-world app, you would emit a WebSocket event here
    // this.websocketGateway.emitNotification(userId, notification);

    return notification;
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: number, limit: number = 50): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId, limit);
  }

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.findUnreadByUserId(userId);
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId);
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number, userId: number): Promise<void> {
    // Verify notification belongs to user
    const notification = this.notificationRepository.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    if (notification.userId !== userId) {
      throw new Error('Unauthorized');
    }

    this.notificationRepository.markAsRead(notificationId);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: number): Promise<void> {
    this.notificationRepository.markAllAsReadForUser(userId);
  }

  /**
   * Send notification when booking is created
   */
  async notifyBookingRequest(driverId: number, bookingId: number, riderName: string): Promise<void> {
    await this.createNotification({
      userId: driverId,
      type: 'MATCH',
      title: 'New Booking Request',
      body: `${riderName} has requested to book your ride`,
      relatedRideId: bookingId,
    });
  }

  /**
   * Send notification when booking is confirmed
   */
  async notifyBookingConfirmed(riderId: number, bookingId: number, driverName: string): Promise<void> {
    await this.createNotification({
      userId: riderId,
      type: 'PAYMENT',
      title: 'Booking Confirmed',
      body: `${driverName} has confirmed your booking`,
      relatedRideId: bookingId,
    });
  }

  /**
   * Send notification when booking is cancelled
   */
  async notifyBookingCancelled(
    userId: number,
    bookingId: number,
    cancelledBy: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'RIDE_CANCELLED',
      title: 'Booking Cancelled',
      body: `Your booking has been cancelled by ${cancelledBy}`,
      relatedRideId: bookingId,
    });
  }

  /**
   * Send notification when ride starts
   */
  async notifyRideStarted(rideId: number, userIds: number[], safetyCode?: string): Promise<void> {
    const codeMessage = safetyCode 
      ? ` Safety Code: ${safetyCode}` 
      : '';
    
    const promises = userIds.map((userId) =>
      this.createNotification({
        userId,
        type: 'MESSAGE',
        title: 'Ride Started',
        body: `Your ride has started. Have a safe journey!${codeMessage}`,
        relatedRideId: rideId,
      })
    );
    await Promise.all(promises);
  }

  /**
   * Send notification when ride is completed
   */
  async notifyRideCompleted(rideId: number, userIds: number[]): Promise<void> {
    const promises = userIds.map((userId) =>
      this.createNotification({
        userId,
        type: 'RIDE_COMPLETED',
        title: 'Ride Completed',
        body: 'Your ride has been completed. Please rate your experience.',
        relatedRideId: rideId,
      })
    );
    await Promise.all(promises);
  }

  /**
   * Send notification when driver is verified
   */
  async notifyDriverVerified(userId: number): Promise<void> {
    await this.createNotification({
      userId,
      type: 'SYSTEM',
      title: 'Driver Verification Complete',
      body: 'Congratulations! You can now start offering rides.',
    });
  }

  /**
   * Send system notification
   */
  async sendSystemNotification(userId: number, title: string, body: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'SYSTEM',
      title,
      body,
    });
  }

  /**
   * Clean up old read notifications (run periodically)
   */
  async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
    return this.notificationRepository.deleteOldReadNotifications(daysOld);
  }
}
