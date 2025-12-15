import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { AuthService } from './auth.service';
import { CreateUserDto, VerifyCodeDto, SendVerificationDto } from '../dto/user.dto';
import { Public } from './public.decorator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  emailOrPhone: string; // Can be email or phone number

  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.emailOrPhone, loginDto.password);
  }

  @Public()
  @Post('send-verification')
  @HttpCode(HttpStatus.OK)
  async sendVerification(@Body() dto: SendVerificationDto) {
    return this.authService.sendVerificationCode(dto.emailOrPhone);
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto.emailOrPhone, dto.code);
  }
}
