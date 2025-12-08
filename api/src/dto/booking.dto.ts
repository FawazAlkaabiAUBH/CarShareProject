import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, Min, Matches } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  rideId: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  seatsBooked?: number; // Optional, defaults to 1

  @IsNotEmpty()
  @IsEnum(['CASH', 'BENEFITPAY'])
  paymentMethod: 'CASH' | 'BENEFITPAY';

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'BenefitPay phone must be 8 digits',
  })
  benefitPayPhone?: string; // Required if paymentMethod is BENEFITPAY
}

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
