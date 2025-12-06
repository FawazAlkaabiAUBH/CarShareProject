export class CreateBookingDto {
  riderId: number;
  rideId: number;
  seatsBooked?: number; // Optional, defaults to 1
}

export class UpdateBookingStatusDto {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  cancellationReason?: string;
}
