import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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

  @IsNotEmpty()
  @IsString()
  aubhId: string; // AUBH student/staff ID - required

  @IsNotEmpty()
  @IsIn(['MALE', 'FEMALE'])
  gender: 'MALE' | 'FEMALE'; // Gender - required

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
  name?: string;

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
  aubhId?: string;

  @IsOptional()
  @IsIn(['MALE', 'FEMALE'])
  gender?: 'MALE' | 'FEMALE';

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

export class VerifyCodeDto {
  @IsNotEmpty()
  @IsString()
  emailOrPhone: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'Verification code must be 6 digits',
  })
  code: string;
}

export class SendVerificationDto {
  @IsNotEmpty()
  @IsString()
  emailOrPhone: string;
}
