export class Booking {
  bookingId: number;
  rideId: number;
  riderId: number;
  seatsBooked: number;
  totalFare: number;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);
  }
}
