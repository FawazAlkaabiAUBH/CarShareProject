export class CreateRideDto {
  driverId: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string; // ISO date string
  availableSeats: number;
  fareEstimate?: number;
}

export class UpdateRideDto {
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupTime?: string;
  availableSeats?: number;
  fareEstimate?: number;
  rideStatus?:
    | 'AVAILABLE'
    | 'BOOKED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';
}
