import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, Min } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  rideId: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  seatsBooked?: number; // Optional, defaults to 1
}

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
