import { Injectable } from '@nestjs/common';
import { Rider } from '../entities/rider.entity';

@Injectable()
export class RiderRepository {
  private riders: Map<number, Rider> = new Map();
  private currentId = 1;

  constructor() {
    this.seed();
  }

  private seed() {
    const testRider = new Rider({
      riderId: 1,
      userId: 2,
      defaultPickupLocation: 'Seef District',
      loyaltyPoints: 0,
      paymentMethod: 'Cash',
      preferredDriver: '',
    });

    this.riders.set(testRider.riderId, testRider);
    this.currentId = 2;
  }

  findById(riderId: number): Rider | undefined {
    return this.riders.get(riderId);
  }

  findByUserId(userId: number): Rider | undefined {
    return Array.from(this.riders.values()).find((r) => r.userId === userId);
  }

  findByPreferredDriver(driverId: number): Rider[] {
    return Array.from(this.riders.values()).filter(
      (r) => r.preferredDriver === String(driverId),
    );
  }

  save(rider: Partial<Rider>): Rider {
    if (!rider.riderId) {
      rider.riderId = this.currentId++;
      rider.loyaltyPoints = rider.loyaltyPoints || 0;
    }

    const fullRider = new Rider(rider as Rider);
    this.riders.set(fullRider.riderId, fullRider);
    return fullRider;
  }

  delete(riderId: number): void {
    this.riders.delete(riderId);
  }

  updatePaymentMethod(riderId: number, method: string): void {
    const rider = this.riders.get(riderId);
    if (rider) {
      rider.paymentMethod = method;
    }
  }

  updatePickupLocation(riderId: number, location: string): void {
    const rider = this.riders.get(riderId);
    if (rider) {
      rider.defaultPickupLocation = location;
    }
  }

  incrementLoyaltyPoints(riderId: number, delta: number): void {
    const rider = this.riders.get(riderId);
    if (rider) {
      rider.loyaltyPoints += delta;
    }
  }

  findAll(): Rider[] {
    return Array.from(this.riders.values());
  }
}
