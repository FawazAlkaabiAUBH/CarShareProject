import { Injectable } from '@nestjs/common';
import { RiderRepository } from '../repositories/rider.repository';
import { RegisterRiderDto, UpdateRiderDto } from '../dto/rider.dto';
import { Rider } from '../entities/rider.entity';

@Injectable()
export class RiderService {
  constructor(private readonly riderRepository: RiderRepository) {}

  registerRider(registerRiderDto: RegisterRiderDto): Rider {
    return this.riderRepository.save(registerRiderDto);
  }

  getRiderByUserId(userId: number): Rider {
    const rider = this.riderRepository.findByUserId(userId);
    if (!rider) {
      throw new Error(`Rider for user ID ${userId} not found`);
    }
    return rider;
  }

  updatePaymentMethod(riderId: number, method: string): void {
    this.riderRepository.updatePaymentMethod(riderId, method);
  }

  updatePreferredDriver(riderId: number, driverId: string): Rider {
    const rider = this.riderRepository.findById(riderId);
    if (!rider) {
      throw new Error(`Rider with ID ${riderId} not found`);
    }
    // Note: preferredDriver field removed from schema
    return rider;
  }

  updatePickupLocation(riderId: number, location: string): void {
    this.riderRepository.updatePickupLocation(riderId, location);
  }

  updateRider(riderId: number, updateRiderDto: UpdateRiderDto): Rider {
    const rider = this.riderRepository.findById(riderId);
    if (!rider) {
      throw new Error(`Rider with ID ${riderId} not found`);
    }
    return this.riderRepository.save({ ...rider, ...updateRiderDto });
  }

  getRiderById(riderId: number): Rider {
    const rider = this.riderRepository.findById(riderId);
    if (!rider) {
      throw new Error(`Rider with ID ${riderId} not found`);
    }
    return rider;
  }

  getAllRiders(): Rider[] {
    return this.riderRepository.findAll();
  }

  incrementLoyaltyPoints(riderId: number, points: number): void {
    this.riderRepository.incrementLoyaltyPoints(riderId, points);
  }
}
