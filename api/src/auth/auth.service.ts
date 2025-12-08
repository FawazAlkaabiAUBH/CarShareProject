import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { RiderRepository } from '../repositories/rider.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly riderRepository: RiderRepository,
    private readonly driverRepository: DriverRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Check phone number uniqueness
    if (createUserDto.phoneNumber) {
      const existingPhone = this.userRepository.findByPhone(createUserDto.phoneNumber);
      if (existingPhone) {
        throw new UnauthorizedException('User with this phone number already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with USER role (no driver option during signup)
    const user = await this.userRepository.save({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      phoneNumber: createUserDto.phoneNumber,
      aubhId: createUserDto.aubhId,
      gender: createUserDto.gender,
      benefitPayPhone: createUserDto.benefitPayPhone,
      role: createUserDto.role || 'USER',
      accountStatus: 'ACTIVE',
      isVerified: false, // Will be verified via code
    });

    // Automatically create rider profile (everyone needs this to book rides)
    this.riderRepository.save({
      userId: user.userId,
      preferredPickupLocation: '',
      rating: 5.0,
      totalRides: 0,
    });

    // Generate verification code
    const verificationCode = this.generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    this.userRepository.setVerificationCode(user.userId, verificationCode, expiry);

    // TODO: Send verification code via SMS/Email
    console.log(`Verification code for ${user.email}: ${verificationCode}`);

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user without password
    const { password, verificationCode: code, verificationCodeExpiry, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: token,
      message: 'Verification code sent. Please verify your account.',
    };
  }

  async login(emailOrPhone: string, password: string) {
    // Find user by email or phone
    const user = this.userRepository.findByEmailOrPhone(emailOrPhone);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    this.userRepository.updateLastLogin(user.userId, new Date());

    // Generate JWT token
    const token = this.generateToken(user);

    // Check if user has driver or rider profiles
    const driver = this.driverRepository.findByUserId(user.userId);
    const rider = this.riderRepository.findByUserId(user.userId);

    // Return user without password
    const { password: _, verificationCode, verificationCodeExpiry, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: token,
      hasDriverProfile: !!driver,
      hasRiderProfile: !!rider,
    };
  }

  async sendVerificationCode(emailOrPhone: string) {
    const user = this.userRepository.findByEmailOrPhone(emailOrPhone);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate new verification code
    const verificationCode = this.generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    this.userRepository.setVerificationCode(user.userId, verificationCode, expiry);

    // TODO: Send verification code via SMS/Email
    console.log(`Verification code for ${emailOrPhone}: ${verificationCode}`);

    return {
      message: 'Verification code sent successfully',
      expiresIn: '10 minutes',
    };
  }

  async verifyCode(emailOrPhone: string, code: string) {
    const user = this.userRepository.findByEmailOrPhone(emailOrPhone);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if code matches
    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    // Check if code is expired
    if (user.verificationCodeExpiry && user.verificationCodeExpiry < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    // Mark user as verified
    this.userRepository.verifyUser(user.userId);

    // Generate new token
    const token = this.generateToken(user);

    const { password, verificationCode: _, verificationCodeExpiry: __, ...userWithoutPassword } = user;
    return {
      message: 'Account verified successfully',
      user: { ...userWithoutPassword, isVerified: true },
      access_token: token,
    };
  }

  async validateUser(userId: number) {
    return this.userRepository.findById(userId);
  }

  private generateToken(user: any): string {
    const payload = { 
      email: user.email, 
      sub: user.userId, 
      role: user.role 
    };
    return this.jwtService.sign(payload);
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
