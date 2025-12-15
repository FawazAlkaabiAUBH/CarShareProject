export class Notification {
  notificationId: number;
  userId: number;
  type: 'MATCH' | 'PAYMENT' | 'MESSAGE' | 'RIDE_COMPLETED' | 'RIDE_CANCELLED' | 'SYSTEM';
  title: string;
  body: string;
  relatedRideId?: number;
  relatedUserId?: number;
  isRead: boolean;
  createdAt: Date;

  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
  }
}
