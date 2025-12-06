import { Injectable } from '@nestjs/common';
import { Ride } from '../entities/ride.entity';

@Injectable()
export class RideRepository {
  private rides: Map<number, Ride> = new Map();
  private currentId = 1;

  constructor() {
    this.seed();
  }

  private seed() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const testRide = new Ride({
      rideId: 1,
      driverId: 1,
      riderId: null,
      pickupLocation: 'Seef District',
      dropoffLocation: 'AUBH Campus',
      pickupTime: tomorrow,
      dropoffTime: null,
      rideStatus: 'AVAILABLE',
      fareEstimate: 2.5,
      availableSeats: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.rides.set(testRide.rideId, testRide);
    this.currentId = 2;
  }

  findById(rideId: number): Ride | undefined {
    return this.rides.get(rideId);
  }

  findByDriver(driverId: number): Ride[] {
    return Array.from(this.rides.values()).filter(
      (r) => r.driverId === driverId,
    );
  }

  findByRider(riderId: number): Ride[] {
    return Array.from(this.rides.values()).filter((r) => r.riderId === riderId);
  }

  findAvailable(pickupLocation?: string, at?: Date): Ride[] {
    let rides = Array.from(this.rides.values()).filter(
      (r) => r.rideStatus === 'AVAILABLE' && r.availableSeats > 0,
    );

    if (pickupLocation) {
      rides = rides.filter((r) =>
        r.pickupLocation.toLowerCase().includes(pickupLocation.toLowerCase()),
      );
    }

    if (at) {
      rides = rides.filter((r) => r.pickupTime >= at);
    }

    return rides;
  }

  save(ride: Partial<Ride>): Ride {
    if (!ride.rideId) {
      ride.rideId = this.currentId++;
      ride.createdAt = new Date();
      ride.rideStatus = ride.rideStatus || 'AVAILABLE';
    }
    ride.updatedAt = new Date();

    const fullRide = new Ride(ride as Ride);
    this.rides.set(fullRide.rideId, fullRide);
    return fullRide;
  }

  delete(rideId: number): void {
    this.rides.delete(rideId);
  }

  updateStatus(rideId: number, status: Ride['rideStatus']): void {
    const ride = this.rides.get(rideId);
    if (ride) {
      ride.rideStatus = status;
      ride.updatedAt = new Date();
    }
  }

  updateLocations(rideId: number, pickup: string, dropoff: string): void {
    const ride = this.rides.get(rideId);
    if (ride) {
      ride.pickupLocation = pickup;
      ride.dropoffLocation = dropoff;
      ride.updatedAt = new Date();
    }
  }

  updateFareEstimate(rideId: number, estimate: number): void {
    const ride = this.rides.get(rideId);
    if (ride) {
      ride.fareEstimate = estimate;
      ride.updatedAt = new Date();
    }
  }

  decrementSeats(rideId: number): boolean {
    const ride = this.rides.get(rideId);
    if (ride && ride.availableSeats > 0) {
      ride.availableSeats--;
      ride.updatedAt = new Date();
      return true;
    }
    return false;
  }

  incrementSeats(rideId: number): void {
    const ride = this.rides.get(rideId);
    if (ride) {
      ride.availableSeats++;
      ride.updatedAt = new Date();
    }
  }
}
