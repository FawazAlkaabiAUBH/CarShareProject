import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto/vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async getVehicleById(vehicleId: number): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }
    return vehicle;
  }

  async getVehiclesByUserId(userId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.findByUserId(userId);
  }

  async getActiveVehiclesByUserId(userId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.findActiveByUserId(userId);
  }

  async createVehicle(userId: number, dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new Vehicle({
      userId,
      make: dto.make,
      model: dto.model,
      year: dto.year,
      color: dto.color,
      licensePlate: dto.licensePlate,
      vehicleDocument: dto.vehicleDocument,
      isActive: true,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async updateVehicle(vehicleId: number, userId: number, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.getVehicleById(vehicleId);
    
    // Check ownership
    if (vehicle.userId !== userId) {
      throw new BadRequestException('You can only update your own vehicles');
    }

    const updated = new Vehicle({
      ...vehicle,
      ...dto,
    });

    return this.vehicleRepository.save(updated);
  }

  async deactivateVehicle(vehicleId: number, userId: number): Promise<void> {
    const vehicle = await this.getVehicleById(vehicleId);
    
    // Check ownership
    if (vehicle.userId !== userId) {
      throw new BadRequestException('You can only deactivate your own vehicles');
    }

    this.vehicleRepository.deactivate(vehicleId);
  }

  async deleteVehicle(vehicleId: number, userId: number): Promise<void> {
    const vehicle = await this.getVehicleById(vehicleId);
    
    // Check ownership
    if (vehicle.userId !== userId) {
      throw new BadRequestException('You can only delete your own vehicles');
    }

    this.vehicleRepository.delete(vehicleId);
  }
}
