import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, {
    message: 'Phone number must be valid (e.g., +973-1234-5678 or 17001234)',
  })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'BenefitPay phone must be 8 digits',
  })
  benefitPayPhone?: string;

  @IsOptional()
  role?: 'USER' | 'ADMIN'; // Defaults to USER
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, {
    message: 'Phone number must be valid (e.g., +973-1234-5678 or 17001234)',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'BenefitPay phone must be 8 digits',
  })
  benefitPayPhone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
