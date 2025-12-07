import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with USER role (no driver option during signup)
    const user = this.userRepository.save({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      phoneNumber: createUserDto.phoneNumber,
      role: createUserDto.role || 'USER',
      accountStatus: 'ACTIVE',
    });

    // Automatically create rider profile (everyone needs this to book rides)
    this.riderRepository.save({
      userId: user.userId,
      preferredPickupLocation: '',
      rating: 5.0,
      totalRides: 0,
    });

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: token,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = this.userRepository.findByEmail(email);
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

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
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
}
