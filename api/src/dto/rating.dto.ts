import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsNumber()
  rideId: number;

  @IsNotEmpty()
  @IsNumber()
  riderId: number;

  @IsNotEmpty()
  @IsNumber()
  driverId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  score: number; // 1-5

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  feedbackTags?: string[];
}

export class UpdateRatingDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  score?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  feedbackTags?: string[];
}
