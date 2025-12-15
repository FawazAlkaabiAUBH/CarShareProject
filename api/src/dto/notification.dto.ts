import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsEnum(['MATCH', 'PAYMENT', 'MESSAGE', 'RIDE_COMPLETED', 'RIDE_CANCELLED', 'SYSTEM'])
  type: 'MATCH' | 'PAYMENT' | 'MESSAGE' | 'RIDE_COMPLETED' | 'RIDE_CANCELLED' | 'SYSTEM';

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsNumber()
  relatedRideId?: number;

  @IsOptional()
  @IsNumber()
  relatedUserId?: number;
}

export class MarkNotificationReadDto {
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;
}
