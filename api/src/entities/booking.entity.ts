export class Booking {
  bookingId: number;
  riderId: number;
  driverId: number;
  rideId: number;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  bookingTime: Date;
  assignedTime: Date | null;
  completedTime: Date | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);
  }
}
