import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsEnum([
    'BOOKING_REQUEST',
    'BOOKING_CONFIRMED',
    'BOOKING_CANCELLED',
    'RIDE_STARTED',
    'RIDE_COMPLETED',
    'DRIVER_VERIFIED',
    'SYSTEM',
  ])
  type:
    | 'BOOKING_REQUEST'
    | 'BOOKING_CONFIRMED'
    | 'BOOKING_CANCELLED'
    | 'RIDE_STARTED'
    | 'RIDE_COMPLETED'
    | 'DRIVER_VERIFIED'
    | 'SYSTEM';

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @IsOptional()
  @IsNumber()
  relatedEntityId?: number;
}

export class MarkNotificationReadDto {
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;
}
