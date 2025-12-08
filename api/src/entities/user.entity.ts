export class User {
  userId: number;
  name: string;
  email: string;
  password: string; // Hashed password
  phoneNumber: string;
  aubhId?: string; // AUBH student/staff ID
  gender?: 'MALE' | 'FEMALE'; // User gender
  benefitPayPhone?: string; // BenefitPay phone number for payments
  role: 'USER' | 'ADMIN'; // Permission level
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  verificationCode?: string; // Temporary 6-digit verification code
  verificationCodeExpiry?: Date; // Expiry time for verification code
  isVerified: boolean; // Whether email/phone is verified
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
