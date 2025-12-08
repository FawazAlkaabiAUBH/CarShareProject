export class Booking {
  bookingId: number;
  rideId: number;
  userId: number;
  seatsBooked: number;
  paymentMethod: 'CASH' | 'BENEFITPAY';
  benefitPayPhone?: string;
  farePerSeat: number;
  totalAmount: number;
  totalFare: number; // Same as totalAmount, added for frontend compatibility
  serviceFee: number;
  driverEarnings: number;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  cancellationReason?: string;
  cancelledBy?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);
  }
}
