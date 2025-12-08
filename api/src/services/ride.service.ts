import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { RideRepository } from '../repositories/ride.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { SystemSettingsRepository } from '../repositories/system-settings.repository';
import { NotificationService } from './notification.service';
import { CreateRideDto, UpdateRideDto } from '../dto/ride.dto';
import { Ride } from '../entities/ride.entity';

@Injectable()
export class RideService {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly driverRepository: DriverRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly systemSettingsRepository: SystemSettingsRepository,
    private readonly notificationService: NotificationService,
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

    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(
      createRideDto.originLat,
      createRideDto.originLng,
      createRideDto.destinationLat,
      createRideDto.destinationLng,
    );

    // Calculate fare breakdown
    const fareBreakdown = this.calculateFare(distance);

    // Generate 4-digit safety code
    const safetyCode = this.generateSafetyCode();

    const ride = this.rideRepository.save({
      userId,
      vehicleId: createRideDto.vehicleId,
      origin: createRideDto.origin,
      destination: createRideDto.destination,
      originLat: createRideDto.originLat,
      originLng: createRideDto.originLng,
      destinationLat: createRideDto.destinationLat,
      destinationLng: createRideDto.destinationLng,
      distance: parseFloat(distance.toFixed(2)),
      estimatedDuration: createRideDto.estimatedDuration || Math.ceil(distance * 2), // Default: 2 min/km
      departureTime: new Date(createRideDto.departureTime),
      baseFare: fareBreakdown.baseFare,
      distanceFare: fareBreakdown.distanceFare,
      serviceFee: fareBreakdown.serviceFee,
      totalFare: fareBreakdown.totalFare,
      driverEarnings: fareBreakdown.driverEarnings,
      farePerSeat: parseFloat((fareBreakdown.totalFare / createRideDto.totalSeats).toFixed(3)),
      totalSeats: createRideDto.totalSeats,
      availableSeats: createRideDto.totalSeats,
      safetyCode,
      rideStatus: 'AVAILABLE',
    });

    // Increment driver's total rides
    this.driverRepository.incrementTotalRides(userId);

    return ride;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private calculateFare(distance: number): {
    baseFare: number;
    distanceFare: number;
    serviceFee: number;
    totalFare: number;
    driverEarnings: number;
  } {
    // Fetch from system_settings table
    const settings = this.systemSettingsRepository.getFareSettings();

    const distanceFare = distance * settings.farePerKm;
    const subtotal = settings.baseFare + distanceFare;
    const serviceFee = subtotal * (settings.serviceFeePercentage / 100);
    const totalFare = Math.max(subtotal + serviceFee, settings.minFare);
    const driverEarnings = totalFare - serviceFee;

    return {
      baseFare: parseFloat(settings.baseFare.toFixed(3)),
      distanceFare: parseFloat(distanceFare.toFixed(3)),
      serviceFee: parseFloat(serviceFee.toFixed(3)),
      totalFare: parseFloat(totalFare.toFixed(3)),
      driverEarnings: parseFloat(driverEarnings.toFixed(3)),
    };
  }

  private generateSafetyCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
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
      departureTime: updateRideDto.departureTime
        ? new Date(updateRideDto.departureTime)
        : ride.departureTime,
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
    
    // Get fresh ride data with updated status
    const updatedRide = this.rideRepository.findById(rideId);
    if (!updatedRide) {
      throw new NotFoundException(`Ride with ID ${rideId} not found after update`);
    }
    
    // Note: Notification to passengers will be sent by a future integration
    // For now, the safety code is displayed in the ride details page
    
    return updatedRide;
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

    ride.arrivalTime = new Date();
    ride.rideStatus = 'COMPLETED';
    return this.rideRepository.save(ride);
  }

  getAvailableRides(origin?: string, destination?: string, startDate?: Date, endDate?: Date): Ride[] {
    const now = new Date();
    return this.rideRepository.findAvailable(origin, destination, now, startDate, endDate);
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

  /**
   * Advanced ride search with proximity filtering
   * @param userLat User's latitude
   * @param userLng User's longitude
   * @param destLat Optional destination latitude
   * @param destLng Optional destination longitude
   * @param maxPickupDistance Maximum distance to pickup point in km
   * @param maxDropoffDistance Maximum distance from destination in km
   * @param startDate Optional departure start date filter
   * @param endDate Optional departure end date filter
   */
  searchNearbyRides(
    userLat: number,
    userLng: number,
    destLat?: number,
    destLng?: number,
    maxPickupDistance: number = 5, // 5km default
    maxDropoffDistance: number = 5, // 5km default
    startDate?: Date,
    endDate?: Date,
  ): Array<Ride & { distanceToPickup: number; distanceToDropoff?: number }> {
    // Get all available rides
    const rides = this.rideRepository.findAvailable(undefined, undefined, new Date(), startDate, endDate);

    // Calculate distances and filter
    const ridesWithDistance = rides
      .map((ride) => {
        const distanceToPickup = this.calculateDistance(
          userLat,
          userLng,
          ride.originLat,
          ride.originLng,
        );

        let distanceToDropoff: number | undefined;
        if (destLat !== undefined && destLng !== undefined) {
          distanceToDropoff = this.calculateDistance(
            destLat,
            destLng,
            ride.destinationLat,
            ride.destinationLng,
          );
        }

        return {
          ...ride,
          distanceToPickup: parseFloat(distanceToPickup.toFixed(2)),
          distanceToDropoff: distanceToDropoff !== undefined ? parseFloat(distanceToDropoff.toFixed(2)) : undefined,
        };
      })
      .filter((ride) => {
        // Filter by pickup proximity
        if (ride.distanceToPickup > maxPickupDistance) {
          return false;
        }

        // Filter by dropoff proximity if destination provided
        if (destLat !== undefined && destLng !== undefined && ride.distanceToDropoff !== undefined) {
          if (ride.distanceToDropoff > maxDropoffDistance) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by pickup distance (closest first)
        return a.distanceToPickup - b.distanceToPickup;
      });

    return ridesWithDistance;
  }

  /**
   * Get rides near a specific location
   */
  getRidesNearLocation(
    lat: number,
    lng: number,
    radius: number = 10, // 10km default
  ): Array<Ride & { distance: number }> {
    const rides = this.rideRepository.findAvailable(undefined, undefined, new Date());

    const nearbyRides = rides
      .map((ride) => {
        const distance = this.calculateDistance(lat, lng, ride.originLat, ride.originLng);
        return {
          ...ride,
          distance: parseFloat(distance.toFixed(2)),
        };
      })
      .filter((ride) => ride.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return nearbyRides;
  }
}
