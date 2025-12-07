import { Injectable } from '@nestjs/common';
import { Ride } from '../entities/ride.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RideRepository {
  constructor(private readonly db: DatabaseService) {}

  findById(rideId: number): Ride | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM rides WHERE rideId = ?')
      .get(rideId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByDriver(userId: number): Ride[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM rides WHERE userId = ?')
      .all(userId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findAvailable(pickupLocation?: string, dropoffLocation?: string, at?: Date, startDate?: Date, endDate?: Date): Ride[] {
    let query = `SELECT * FROM rides WHERE rideStatus = 'AVAILABLE' AND availableSeats > 0`;
    const params: any[] = [];

    if (pickupLocation) {
      query += ` AND pickupLocation LIKE ? COLLATE NOCASE`;
      params.push(`%${pickupLocation}%`);
    }

    if (dropoffLocation) {
      query += ` AND dropoffLocation LIKE ? COLLATE NOCASE`;
      params.push(`%${dropoffLocation}%`);
    }

    if (at) {
      query += ` AND pickupTime >= ?`;
      params.push(at.toISOString());
    }

    if (startDate && endDate) {
      query += ` AND DATE(pickupTime) BETWEEN DATE(?) AND DATE(?)`;
      params.push(startDate.toISOString(), endDate.toISOString());
    } else if (startDate) {
      query += ` AND DATE(pickupTime) >= DATE(?)`;
      params.push(startDate.toISOString());
    } else if (endDate) {
      query += ` AND DATE(pickupTime) <= DATE(?)`;
      params.push(endDate.toISOString());
    }

    const rows = this.db.getDatabase().prepare(query).all(...params) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  save(ride: Partial<Ride>): Ride {
    const now = new Date().toISOString();

    if (!ride.rideId) {
      // Insert new ride
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO rides (userId, vehicleId, pickupLocation, dropoffLocation, pickupTime, dropoffTime, rideStatus, farePerSeat, totalSeats, availableSeats, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        ride.userId,
        ride.vehicleId,
        ride.pickupLocation,
        ride.dropoffLocation,
        ride.pickupTime instanceof Date
          ? ride.pickupTime.toISOString()
          : ride.pickupTime,
        ride.dropoffTime
          ? ride.dropoffTime instanceof Date
            ? ride.dropoffTime.toISOString()
            : ride.dropoffTime
          : null,
        ride.rideStatus || 'AVAILABLE',
        ride.farePerSeat,
        ride.totalSeats,
        ride.availableSeats ?? ride.totalSeats,
        now,
        now,
      );

      return this.findById(info.lastInsertRowid as number)!;
    } else {
      // Update existing ride
      const stmt = this.db.getDatabase().prepare(`
        UPDATE rides
        SET userId = ?, vehicleId = ?, pickupLocation = ?, dropoffLocation = ?, pickupTime = ?, dropoffTime = ?, rideStatus = ?, farePerSeat = ?, totalSeats = ?, availableSeats = ?, updatedAt = ?
        WHERE rideId = ?
      `);

      stmt.run(
        ride.userId,
        ride.vehicleId,
        ride.pickupLocation,
        ride.dropoffLocation,
        ride.pickupTime instanceof Date
          ? ride.pickupTime.toISOString()
          : ride.pickupTime,
        ride.dropoffTime
          ? ride.dropoffTime instanceof Date
            ? ride.dropoffTime.toISOString()
            : ride.dropoffTime
          : null,
        ride.rideStatus,
        ride.farePerSeat,
        ride.totalSeats,
        ride.availableSeats,
        now,
        ride.rideId,
      );

      return this.findById(ride.rideId)!;
    }
  }

  delete(rideId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM rides WHERE rideId = ?')
      .run(rideId);
  }

  updateStatus(rideId: number, status: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE rides SET rideStatus = ?, updatedAt = ? WHERE rideId = ?',
      )
      .run(status, new Date().toISOString(), rideId);
  }

  updateLocations(rideId: number, pickup: string, dropoff: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE rides SET pickupLocation = ?, dropoffLocation = ?, updatedAt = ? WHERE rideId = ?',
      )
      .run(pickup, dropoff, new Date().toISOString(), rideId);
  }

  updateFarePerSeat(rideId: number, farePerSeat: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE rides SET farePerSeat = ?, updatedAt = ? WHERE rideId = ?',
      )
      .run(farePerSeat, new Date().toISOString(), rideId);
  }

  decrementSeats(rideId: number, count: number = 1): boolean {
    const ride = this.findById(rideId);
    if (ride && ride.availableSeats >= count) {
      this.db
        .getDatabase()
        .prepare(
          'UPDATE rides SET availableSeats = availableSeats - ?, updatedAt = ? WHERE rideId = ?',
        )
        .run(count, new Date().toISOString(), rideId);
      return true;
    }
    return false;
  }

  incrementSeats(rideId: number, count: number = 1): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE rides SET availableSeats = availableSeats + ?, updatedAt = ? WHERE rideId = ?',
      )
      .run(count, new Date().toISOString(), rideId);
  }

  private mapToEntity(row: any): Ride {
    return new Ride({
      rideId: row.rideId,
      userId: row.userId,
      vehicleId: row.vehicleId,
      pickupLocation: row.pickupLocation,
      dropoffLocation: row.dropoffLocation,
      pickupTime: new Date(row.pickupTime),
      dropoffTime: row.dropoffTime ? new Date(row.dropoffTime) : undefined,
      rideStatus: row.rideStatus,
      farePerSeat: row.farePerSeat,
      totalSeats: row.totalSeats,
      availableSeats: row.availableSeats,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
