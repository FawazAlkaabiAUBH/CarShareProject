import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverRepository } from '../repositories/driver.repository';
import { RegisterDriverDto, UpdateDriverDto, VerifyDriverDto } from '../dto/driver.dto';
import { Driver } from '../entities/driver.entity';

@Injectable()
export class DriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  registerDriver(registerDriverDto: RegisterDriverDto): Driver {
    return this.driverRepository.save({
      userId: registerDriverDto.userId,
      licenseNumber: registerDriverDto.licenseNumber,
      licenseDocument: registerDriverDto.licenseDocument,
      rating: 5.0,
      totalRides: 0,
    });
  }

  getDriverByUserId(userId: number): Driver | undefined {
    return this.driverRepository.findByUserId(userId);
  }

  updateDriver(userId: number, updateDriverDto: UpdateDriverDto): Driver {
    const driver = this.driverRepository.findByUserId(userId);
    if (!driver) {
      throw new NotFoundException(`Driver for user ID ${userId} not found`);
    }
    return this.driverRepository.save({ ...driver, ...updateDriverDto });
  }

  getAllDrivers(): Driver[] {
    return this.driverRepository.findAll();
  }

  getVerifiedDrivers(): Driver[] {
    return this.driverRepository.findVerified();
  }

  getPendingDrivers(): Driver[] {
    return this.driverRepository.findPending();
  }

  verifyDriver(verifyDriverDto: VerifyDriverDto): Driver {
    const driver = this.driverRepository.findByUserId(verifyDriverDto.userId);
    if (!driver) {
      throw new NotFoundException(`Driver for user ID ${verifyDriverDto.userId} not found`);
    }
    
    return this.driverRepository.save({
      ...driver,
      verifiedAt: new Date(),
      verifiedBy: verifyDriverDto.verifiedBy,
    });
  }

  updateRating(userId: number, rating: number): void {
    this.driverRepository.updateRating(userId, rating);
  }

  incrementTotalRides(userId: number): void {
    this.driverRepository.incrementTotalRides(userId);
  }
}
