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

  findAvailable(origin?: string, destination?: string, at?: Date, startDate?: Date, endDate?: Date): any[] {
    let query = `
      SELECT r.*, u.fullName as driverName, u.phoneNumber as driverPhone
      FROM rides r
      LEFT JOIN users u ON r.userId = u.userId
      WHERE r.rideStatus = 'AVAILABLE' AND r.availableSeats > 0
    `;
    const params: any[] = [];

    if (origin) {
      query += ` AND r.origin LIKE ? COLLATE NOCASE`;
      params.push(`%${origin}%`);
    }

    if (destination) {
      query += ` AND r.destination LIKE ? COLLATE NOCASE`;
      params.push(`%${destination}%`);
    }

    if (at) {
      query += ` AND r.departureTime >= ?`;
      params.push(at.toISOString());
    }

    if (startDate && endDate) {
      query += ` AND DATE(r.departureTime) BETWEEN DATE(?) AND DATE(?)`;
      params.push(startDate.toISOString(), endDate.toISOString());
    } else if (startDate) {
      query += ` AND DATE(r.departureTime) >= DATE(?)`;
      params.push(startDate.toISOString());
    } else if (endDate) {
      query += ` AND DATE(r.departureTime) <= DATE(?)`;
      params.push(endDate.toISOString());
    }

    const rows = this.db.getDatabase().prepare(query).all(...params) as any[];

    return rows.map((row) => ({
      ...this.mapToEntity(row),
      driverName: row.driverName,
      driverPhone: row.driverPhone,
    }));
  }

  save(ride: Partial<Ride>): Ride {
    const now = new Date().toISOString();

    if (!ride.rideId) {
      // Insert new ride
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO rides (
          userId, vehicleId, origin, destination,
          originLat, originLng, destinationLat, destinationLng,
          distance, estimatedDuration, departureTime, arrivalTime,
          rideStatus, baseFare, distanceFare, serviceFee, totalFare, driverEarnings,
          farePerSeat, totalSeats, availableSeats, safetyCode,
          createdAt, updatedAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        ride.userId,
        ride.vehicleId,
        ride.origin,
        ride.destination,
        ride.originLat,
        ride.originLng,
        ride.destinationLat,
        ride.destinationLng,
        ride.distance || null,
        ride.estimatedDuration || null,
        ride.departureTime instanceof Date
          ? ride.departureTime.toISOString()
          : ride.departureTime,
        ride.arrivalTime
          ? ride.arrivalTime instanceof Date
            ? ride.arrivalTime.toISOString()
            : ride.arrivalTime
          : null,
        ride.rideStatus || 'AVAILABLE',
        ride.baseFare,
        ride.distanceFare,
        ride.serviceFee,
        ride.totalFare,
        ride.driverEarnings,
        ride.farePerSeat,
        ride.totalSeats,
        ride.availableSeats ?? ride.totalSeats,
        ride.safetyCode || null,
        now,
        now,
      );

      return this.findById(info.lastInsertRowid as number)!;
    } else {
      // Update existing ride
      const stmt = this.db.getDatabase().prepare(`
        UPDATE rides
        SET userId = ?, vehicleId = ?, origin = ?, destination = ?,
            originLat = ?, originLng = ?, destinationLat = ?, destinationLng = ?,
            distance = ?, estimatedDuration = ?, departureTime = ?, arrivalTime = ?,
            rideStatus = ?, baseFare = ?, distanceFare = ?, serviceFee = ?, totalFare = ?, driverEarnings = ?,
            farePerSeat = ?, totalSeats = ?, availableSeats = ?, safetyCode = ?, updatedAt = ?
        WHERE rideId = ?
      `);

      stmt.run(
        ride.userId,
        ride.vehicleId,
        ride.origin,
        ride.destination,
        ride.originLat,
        ride.originLng,
        ride.destinationLat,
        ride.destinationLng,
        ride.distance || null,
        ride.estimatedDuration || null,
        ride.departureTime instanceof Date
          ? ride.departureTime.toISOString()
          : ride.departureTime,
        ride.arrivalTime
          ? ride.arrivalTime instanceof Date
            ? ride.arrivalTime.toISOString()
            : ride.arrivalTime
          : null,
        ride.rideStatus,
        ride.baseFare,
        ride.distanceFare,
        ride.serviceFee,
        ride.totalFare,
        ride.driverEarnings,
        ride.farePerSeat,
        ride.totalSeats,
        ride.availableSeats,
        ride.safetyCode || null,
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

  updateLocations(rideId: number, origin: string, destination: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE rides SET origin = ?, destination = ?, updatedAt = ? WHERE rideId = ?',
      )
      .run(origin, destination, new Date().toISOString(), rideId);
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
      origin: row.origin,
      destination: row.destination,
      originLat: row.originLat,
      originLng: row.originLng,
      destinationLat: row.destinationLat,
      destinationLng: row.destinationLng,
      distance: row.distance,
      estimatedDuration: row.estimatedDuration,
      departureTime: new Date(row.departureTime),
      arrivalTime: row.arrivalTime ? new Date(row.arrivalTime) : undefined,
      rideStatus: row.rideStatus,
      baseFare: row.baseFare,
      distanceFare: row.distanceFare,
      serviceFee: row.serviceFee,
      totalFare: row.totalFare,
      driverEarnings: row.driverEarnings,
      farePerSeat: row.farePerSeat,
      totalSeats: row.totalSeats,
      availableSeats: row.availableSeats,
      safetyCode: row.safetyCode,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
