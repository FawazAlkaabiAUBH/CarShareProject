import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @IsOptional()
  @IsString()
  vehicleDocument?: string;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsString()
  vehicleDocument?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
