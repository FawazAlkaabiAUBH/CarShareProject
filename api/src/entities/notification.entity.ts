export class Notification {
  notificationId: number;
  userId: number;
  type:
    | 'BOOKING_REQUEST'
    | 'BOOKING_CONFIRMED'
    | 'BOOKING_CANCELLED'
    | 'RIDE_STARTED'
    | 'RIDE_COMPLETED'
    | 'DRIVER_VERIFIED'
    | 'SYSTEM';
  title: string;
  message: string;
  relatedEntityType?: string; // e.g., 'booking', 'ride'
  relatedEntityId?: number;
  isRead: boolean;
  createdAt: Date;

  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
  }
}
