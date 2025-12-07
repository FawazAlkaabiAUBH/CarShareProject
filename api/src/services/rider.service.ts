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
      throw new Error(
        `No rider profile found for user ID ${userId}. Users must register as a rider before booking rides.`
      );
    }
    return rider;
  }

  updatePickupLocation(userId: number, location: string): void {
    this.riderRepository.updatePickupLocation(userId, location);
  }

  updateRider(userId: number, updateRiderDto: UpdateRiderDto): Rider {
    const rider = this.riderRepository.findByUserId(userId);
    if (!rider) {
      throw new Error(`Rider profile not found for user ID ${userId}`);
    }
    return this.riderRepository.save({ ...rider, ...updateRiderDto });
  }

  getAllRiders(): Rider[] {
    return this.riderRepository.findAll();
  }
}
