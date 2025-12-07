import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class RegisterRiderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  defaultPickupLocation: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
}

export class UpdateRiderDto {
  @IsOptional()
  @IsString()
  defaultPickupLocation?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  preferredDriver?: string;
}
