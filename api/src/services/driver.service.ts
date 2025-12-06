import { Injectable } from '@nestjs/common';
import { DriverRepository } from '../repositories/driver.repository';
import { RegisterDriverDto, UpdateDriverDto } from '../dto/driver.dto';
import { Driver } from '../entities/driver.entity';

@Injectable()
export class DriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  registerDriver(registerDriverDto: RegisterDriverDto): Driver {
    return this.driverRepository.save(registerDriverDto);
  }

  getDriverByUserId(userId: number): Driver {
    const driver = this.driverRepository.findByUserId(userId);
    if (!driver) {
      throw new Error(`Driver for user ID ${userId} not found`);
    }
    return driver;
  }

  updateVehicle(driverId: number, vehicleInfo: string): void {
    this.driverRepository.updateVehicle(driverId, vehicleInfo);
  }

  updateDriverLicense(driverId: number, licenseNumber: string): void {
    this.driverRepository.updateLicense(driverId, licenseNumber);
  }

  updateDriver(driverId: number, updateDriverDto: UpdateDriverDto): Driver {
    const driver = this.driverRepository.findById(driverId);
    if (!driver) {
      throw new Error(`Driver with ID ${driverId} not found`);
    }
    return this.driverRepository.save({ ...driver, ...updateDriverDto });
  }

  getDriverById(driverId: number): Driver {
    const driver = this.driverRepository.findById(driverId);
    if (!driver) {
      throw new Error(`Driver with ID ${driverId} not found`);
    }
    return driver;
  }

  getAllDrivers(): Driver[] {
    return this.driverRepository.findAll();
  }

  getAvailableDrivers(): Driver[] {
    return this.driverRepository.findAvailable();
  }

  updateRating(driverId: number, rating: number): void {
    this.driverRepository.updateRating(driverId, rating);
  }
}
