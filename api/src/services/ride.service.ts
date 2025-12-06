import { Injectable } from '@nestjs/common';
import { RideRepository } from '../repositories/ride.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { CreateRideDto, UpdateRideDto } from '../dto/ride.dto';
import { Ride } from '../entities/ride.entity';

@Injectable()
export class RideService {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly driverRepository: DriverRepository,
  ) {}

  createRideListing(createRideDto: CreateRideDto): Ride {
    // Verify driver exists
    const driver = this.driverRepository.findById(createRideDto.driverId);
    if (!driver) {
      throw new Error(`Driver with ID ${createRideDto.driverId} not found`);
    }

    const ride = this.rideRepository.save({
      ...createRideDto,
      pickupTime: new Date(createRideDto.pickupTime),
      fareEstimate:
        createRideDto.fareEstimate || this.estimateFare(createRideDto),
    });

    // Increment driver's total rides
    this.driverRepository.incrementTotalRides(createRideDto.driverId);

    return ride;
  }

  updateRideDetails(rideId: number, updateRideDto: UpdateRideDto): Ride {
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new Error(`Ride with ID ${rideId} not found`);
    }

    const updatedRide = {
      ...ride,
      ...updateRideDto,
      pickupTime: updateRideDto.pickupTime
        ? new Date(updateRideDto.pickupTime)
        : ride.pickupTime,
    };

    return this.rideRepository.save(updatedRide);
  }

  cancelRideListing(rideId: number): void {
    this.rideRepository.updateStatus(rideId, 'CANCELLED');
  }

  updateStatus(rideId: number, status: Ride['rideStatus']): void {
    this.rideRepository.updateStatus(rideId, status);
  }

  initiateRideSession(rideId: number): Ride {
    this.rideRepository.updateStatus(rideId, 'IN_PROGRESS');
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new Error(`Ride with ID ${rideId} not found`);
    }
    return ride;
  }

  completeRide(rideId: number): Ride {
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new Error(`Ride with ID ${rideId} not found`);
    }

    ride.dropoffTime = new Date();
    ride.rideStatus = 'COMPLETED';
    return this.rideRepository.save(ride);
  }

  getAvailableRides(pickupLocation?: string): Ride[] {
    const now = new Date();
    return this.rideRepository.findAvailable(pickupLocation, now);
  }

  getRidesByDriver(driverId: number): Ride[] {
    return this.rideRepository.findByDriver(driverId);
  }

  getRideById(rideId: number): Ride {
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new Error(`Ride with ID ${rideId} not found`);
    }
    return ride;
  }

  // Simple fare estimation
  private estimateFare(createRideDto: CreateRideDto): number {
    // Base fare of 1 BHD + 0.5 BHD per seat
    return 1 + createRideDto.availableSeats * 0.5;
  }

  checkSeatAvailability(rideId: number): number {
    const ride = this.rideRepository.findById(rideId);
    return ride ? ride.availableSeats : 0;
  }
}
