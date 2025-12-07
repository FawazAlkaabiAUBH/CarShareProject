import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateRideDto {
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;

  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  departureTime: string; // ISO date string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalSeats: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  farePerSeat: number;
}

export class UpdateRideDto {
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  departureTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalSeats?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  farePerSeat?: number;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'BOOKED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  rideStatus?:
    | 'AVAILABLE'
    | 'BOOKED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';
}
