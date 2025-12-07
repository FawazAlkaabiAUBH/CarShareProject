import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class RegisterDriverDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @IsOptional()
  @IsString()
  licenseDocument?: string; // Base64 or file path
}

export class UpdateDriverDto {
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  licenseDocument?: string; // Base64 or file path
}

export class VerifyDriverDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  verifiedBy: number;
}
