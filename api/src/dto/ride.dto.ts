import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, Min, Max, IsBoolean, Matches } from 'class-validator';

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
  @IsNumber()
  @Min(-90)
  @Max(90)
  originLat: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  originLng: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  destinationLat: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  destinationLng: number;

  @IsNotEmpty()
  @IsString()
  departureTime: string; // ISO date string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalSeats: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedDuration?: number; // Optional, in minutes

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean; // Whether this is a recurring/scheduled ride

  @IsOptional()
  @IsString()
  recurringSchedule?: string; // JSON string with recurring details
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
  @IsNumber()
  @Min(-90)
  @Max(90)
  originLat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  originLng?: number;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  destinationLat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  destinationLng?: number;

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
  estimatedDuration?: number;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'BOOKED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  rideStatus?:
    | 'AVAILABLE'
    | 'BOOKED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';
}

export class VerifySafetyCodeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'Safety code must be 4 digits',
  })
  safetyCode: string;
}
