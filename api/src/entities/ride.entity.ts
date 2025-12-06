export class Ride {
  rideId: number;
  driverId: number;
  riderId: number | null; // Can be null if not assigned yet
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: Date;
  dropoffTime: Date | null;
  rideStatus: 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  fareEstimate: number;
  availableSeats: number; // Added for easier seat management
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Ride>) {
    Object.assign(this, partial);
  }
}
