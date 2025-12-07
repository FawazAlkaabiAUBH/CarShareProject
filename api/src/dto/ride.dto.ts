export class CreateRideDto {
  vehicleId: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string; // ISO date string
  totalSeats: number;
  farePerSeat: number;
}

export class UpdateRideDto {
  vehicleId?: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupTime?: string;
  totalSeats?: number;
  farePerSeat?: number;
  rideStatus?:
    | 'AVAILABLE'
    | 'BOOKED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';
}
