import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { RideRepository } from '../repositories/ride.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { CreateRideDto, UpdateRideDto } from '../dto/ride.dto';
import { Ride } from '../entities/ride.entity';

@Injectable()
export class RideService {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly driverRepository: DriverRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  createRideListing(createRideDto: CreateRideDto, userId: number): Ride {
    // Verify the user is actually registered as a driver
    const driver = this.driverRepository.findByUserId(userId);
    if (!driver) {
      throw new ForbiddenException('Only registered drivers can create ride listings. Please register as a driver first.');
    }

    // Verify driver is verified
    if (!driver.verifiedAt) {
      throw new ForbiddenException('Your driver account must be verified before you can create rides. Please wait for admin verification.');
    }

    // Verify vehicle exists and belongs to the user
    const vehicle = this.vehicleRepository.findById(createRideDto.vehicleId);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${createRideDto.vehicleId} not found`);
    }

    if (vehicle.userId !== userId) {
      throw new ForbiddenException('You can only create rides using your own vehicles');
    }

    if (!vehicle.isActive) {
      throw new BadRequestException('Cannot create ride with inactive vehicle');
    }

    const ride = this.rideRepository.save({
      userId,
      vehicleId: createRideDto.vehicleId,
      pickupLocation: createRideDto.pickupLocation,
      dropoffLocation: createRideDto.dropoffLocation,
      pickupTime: new Date(createRideDto.pickupTime),
      farePerSeat: createRideDto.farePerSeat,
      totalSeats: createRideDto.totalSeats,
      availableSeats: createRideDto.totalSeats,
      rideStatus: 'AVAILABLE',
    });

    // Increment driver's total rides
    this.driverRepository.incrementTotalRides(userId);

    return ride;
  }

  updateRideDetails(rideId: number, updateRideDto: UpdateRideDto, userId: number): Ride {
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${rideId} not found`);
    }

    // Verify the user is the driver who created this ride
    if (ride.userId !== userId) {
      throw new ForbiddenException('You can only update your own rides');
    }

    // If updating vehicle, verify ownership
    if (updateRideDto.vehicleId && updateRideDto.vehicleId !== ride.vehicleId) {
      const vehicle = this.vehicleRepository.findById(updateRideDto.vehicleId);
      if (!vehicle || vehicle.userId !== userId) {
        throw new ForbiddenException('You can only use your own vehicles');
      }
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

  cancelRideListing(rideId: number, userId: number): void {
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${rideId} not found`);
    }

    // Verify the user is the driver who created this ride
    if (ride.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own rides');
    }

    this.rideRepository.updateStatus(rideId, 'CANCELLED');
  }

  updateStatus(rideId: number, status: Ride['rideStatus']): void {
    this.rideRepository.updateStatus(rideId, status);
  }

  initiateRideSession(rideId: number, userId: number): Ride {
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${rideId} not found`);
    }

    // Verify the user is the driver who created this ride
    if (ride.userId !== userId) {
      throw new ForbiddenException('You can only start your own rides');
    }

    this.rideRepository.updateStatus(rideId, 'IN_PROGRESS');
    return ride;
  }

  completeRide(rideId: number, userId: number): Ride {
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${rideId} not found`);
    }

    // Verify the user is the driver who created this ride
    if (ride.userId !== userId) {
      throw new ForbiddenException('You can only complete your own rides');
    }

    ride.dropoffTime = new Date();
    ride.rideStatus = 'COMPLETED';
    return this.rideRepository.save(ride);
  }

  getAvailableRides(pickupLocation?: string, dropoffLocation?: string, startDate?: Date, endDate?: Date): Ride[] {
    const now = new Date();
    return this.rideRepository.findAvailable(pickupLocation, dropoffLocation, now, startDate, endDate);
  }

  getRidesByDriver(userId: number): Ride[] {
    return this.rideRepository.findByDriver(userId);
  }

  getRideById(rideId: number): Ride {
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${rideId} not found`);
    }
    return ride;
  }

  checkSeatAvailability(rideId: number): number {
    const ride = this.rideRepository.findById(rideId);
    return ride ? ride.availableSeats : 0;
  }
}
