import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverRepository } from '../repositories/driver.repository';
import { RegisterDriverDto, UpdateDriverDto, VerifyDriverDto } from '../dto/driver.dto';
import { Driver } from '../entities/driver.entity';
import { UserRepository } from '../repositories/user.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { NotificationService } from './notification.service';

@Injectable()
export class DriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly userRepository: UserRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly notificationService: NotificationService,
  ) {}

  registerDriver(registerDriverDto: RegisterDriverDto, userId: number): Driver {
    return this.driverRepository.save({
      userId: userId,
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

  getAllDrivers(): any[] {
    const drivers = this.driverRepository.findAll();
    return drivers.map(driver => {
      const user = this.userRepository.findById(driver.userId);
      const vehicles = this.vehicleRepository.findAllByUserId(driver.userId);
      return {
        ...driver,
        user: user ? {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        } : null,
        vehicles: vehicles || [],
      };
    });
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

  deleteDriver(userId: number): void {
    const driver = this.driverRepository.findByUserId(userId);
    if (!driver) {
      throw new NotFoundException(`Driver for user ID ${userId} not found`);
    }
    // Delete all vehicles associated with this driver
    const vehicles = this.vehicleRepository.findByUserId(userId);
    vehicles.forEach(vehicle => {
      this.vehicleRepository.delete(vehicle.vehicleId);
    });
    // Delete the driver profile
    this.driverRepository.delete(userId);
  }

  verifyDriverAndActivateVehicles(driverUserId: number, adminUserId: number): any {
    const driver = this.driverRepository.findByUserId(driverUserId);
    if (!driver) {
      throw new NotFoundException(`Driver for user ID ${driverUserId} not found`);
    }

    // Update driver with verification - verifiedBy is set server-side
    const updatedDriver = this.driverRepository.save({
      ...driver,
      isVerified: true,
      verifiedBy: adminUserId,
    });

    // Activate all vehicles for this driver
    const vehicles = this.vehicleRepository.findAllByUserId(driverUserId);
    vehicles.forEach(vehicle => {
      this.vehicleRepository.save({
        ...vehicle,
        isActive: true,
      });
    });

    // Send notification to driver
    this.notificationService.notifyDriverVerified(driverUserId)
      .catch(err => console.error('Failed to send notification:', err));

    return {
      driver: updatedDriver,
      vehiclesActivated: vehicles.length,
      message: 'Driver verified and vehicles activated successfully',
    };
  }
}
