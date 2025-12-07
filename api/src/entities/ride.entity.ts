export class Ride {
  rideId: number;
  userId: number;
  vehicleId: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: Date;
  dropoffTime: Date | null;
  rideStatus: 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  farePerSeat: number;
  availableSeats: number;
  totalSeats: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Ride>) {
    Object.assign(this, partial);
  }
}
