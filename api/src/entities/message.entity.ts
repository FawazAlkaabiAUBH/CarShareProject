export class Message {
  id: number;
  rideId: number;
  fromUserId: number;
  toUserId: number;
  text: string;
  isRead: boolean;
  sentAt: Date;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
}
