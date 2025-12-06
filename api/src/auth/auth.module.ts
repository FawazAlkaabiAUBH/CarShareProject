import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from '../repositories/user.repository';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'carshare-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserRepository, DatabaseService],
  exports: [AuthService],
})
export class AuthModule {}
