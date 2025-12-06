export class CreateBookingDto {
  riderId: number;
  rideId: number;
}

export class UpdateBookingStatusDto {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  cancellationReason?: string;
}
