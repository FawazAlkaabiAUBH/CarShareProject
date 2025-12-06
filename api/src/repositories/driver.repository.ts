import { Injectable } from '@nestjs/common';
import { Driver } from '../entities/driver.entity';

@Injectable()
export class DriverRepository {
  private drivers: Map<number, Driver> = new Map();
  private currentId = 1;

  constructor() {
    this.seed();
  }

  private seed() {
    const testDrivers = [
      new Driver({
        driverId: 1,
        userId: 1,
        licenseNumber: 'BH123456',
        vehicleInfo: 'Toyota Camry 2020',
        vehiclePlate: '12345',
        vehicleType: 'Sedan',
        availabilityStatus: 'AVAILABLE',
        totalRidesPosted: 0,
        averageRating: 0,
      }),
      new Driver({
        driverId: 2,
        userId: 3,
        licenseNumber: 'BH654321',
        vehicleInfo: 'Honda Civic 2021',
        vehiclePlate: '67890',
        vehicleType: 'Sedan',
        availabilityStatus: 'AVAILABLE',
        totalRidesPosted: 0,
        averageRating: 0,
      }),
    ];

    testDrivers.forEach((driver) => {
      this.drivers.set(driver.driverId, driver);
      this.currentId = Math.max(this.currentId, driver.driverId + 1);
    });
  }

  findById(driverId: number): Driver | undefined {
    return this.drivers.get(driverId);
  }

  findByUserId(userId: number): Driver | undefined {
    return Array.from(this.drivers.values()).find((d) => d.userId === userId);
  }

  findByAvailability(status: string): Driver[] {
    return Array.from(this.drivers.values()).filter(
      (d) => d.availabilityStatus === status,
    );
  }

  findByVehicleType(type: string): Driver[] {
    return Array.from(this.drivers.values()).filter(
      (d) => d.vehicleType === type,
    );
  }

  save(driver: Partial<Driver>): Driver {
    if (!driver.driverId) {
      driver.driverId = this.currentId++;
      driver.totalRidesPosted = driver.totalRidesPosted || 0;
      driver.averageRating = driver.averageRating || 0;
    }

    const fullDriver = new Driver(driver as Driver);
    this.drivers.set(fullDriver.driverId, fullDriver);
    return fullDriver;
  }

  delete(driverId: number): void {
    this.drivers.delete(driverId);
  }

  updateAvailability(driverId: number, status: Driver['availabilityStatus']): void {
    const driver = this.drivers.get(driverId);
    if (driver) {
      driver.availabilityStatus = status;
    }
  }

  updateVehicle(
    driverId: number,
    info: string,
    plate: string,
    type: string,
  ): void {
    const driver = this.drivers.get(driverId);
    if (driver) {
      driver.vehicleInfo = info;
      driver.vehiclePlate = plate;
      driver.vehicleType = type;
    }
  }

  updateLicense(driverId: number, licenseNumber: string): void {
    const driver = this.drivers.get(driverId);
    if (driver) {
      driver.licenseNumber = licenseNumber;
    }
  }

  incrementTotalRides(driverId: number): void {
    const driver = this.drivers.get(driverId);
    if (driver) {
      driver.totalRidesPosted++;
    }
  }

  findAll(): Driver[] {
    return Array.from(this.drivers.values());
  }

  findAvailable(): Driver[] {
    return this.findByAvailability('AVAILABLE');
  }

  updateRating(driverId: number, rating: number): void {
    const driver = this.drivers.get(driverId);
    if (driver) {
      driver.averageRating = rating;
    }
  }
}
