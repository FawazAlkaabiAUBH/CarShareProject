import { Injectable } from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DriverRepository {
  constructor(private readonly db: DatabaseService) {}

  findById(driverId: number): Driver | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM drivers WHERE driverId = ?')
      .get(driverId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByUserId(userId: number): Driver | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM drivers WHERE userId = ?')
      .get(userId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findVerified(): Driver[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM drivers WHERE isVerified = 1')
      .all() as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findAll(): Driver[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM drivers')
      .all() as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  save(driver: Partial<Driver>): Driver {
    const now = new Date().toISOString();

    if (!driver.driverId) {
      // Insert new driver
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO drivers (userId, vehicleInfo, licenseNumber, rating, totalRides, isVerified, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        driver.userId,
        driver.vehicleInfo,
        driver.licenseNumber,
        driver.rating ?? 0,
        driver.totalRides ?? 0,
        driver.isVerified ?? false ? 1 : 0,
        now,
        now,
      );

      return this.findById(info.lastInsertRowid as number)!;
    } else {
      // Update existing driver
      const stmt = this.db.getDatabase().prepare(`
        UPDATE drivers
        SET userId = ?, vehicleInfo = ?, licenseNumber = ?, rating = ?, totalRides = ?, isVerified = ?, updatedAt = ?
        WHERE driverId = ?
      `);

      stmt.run(
        driver.userId,
        driver.vehicleInfo,
        driver.licenseNumber,
        driver.rating!,
        driver.totalRides!,
        driver.isVerified! ? 1 : 0,
        now,
        driver.driverId,
      );

      return this.findById(driver.driverId)!;
    }
  }

  delete(driverId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM drivers WHERE driverId = ?')
      .run(driverId);
  }

  updateRating(driverId: number, rating: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET rating = ?, updatedAt = ? WHERE driverId = ?',
      )
      .run(rating, new Date().toISOString(), driverId);
  }

  incrementTotalRides(driverId: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET totalRides = totalRides + 1, updatedAt = ? WHERE driverId = ?',
      )
      .run(new Date().toISOString(), driverId);
  }

  verify(driverId: number, isVerified: boolean): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET isVerified = ?, updatedAt = ? WHERE driverId = ?',
      )
      .run(isVerified ? 1 : 0, new Date().toISOString(), driverId);
  }

  updateVehicle(driverId: number, vehicleInfo: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET vehicleInfo = ?, updatedAt = ? WHERE driverId = ?',
      )
      .run(vehicleInfo, new Date().toISOString(), driverId);
  }

  updateAvailability(driverId: number, status: boolean): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET isAvailable = ?, updatedAt = ? WHERE driverId = ?',
      )
      .run(status ? 1 : 0, new Date().toISOString(), driverId);
  }

  updateLicense(driverId: number, licenseNumber: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET licenseNumber = ?, updatedAt = ? WHERE driverId = ?',
      )
      .run(licenseNumber, new Date().toISOString(), driverId);
  }

  findAvailable(): Driver[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM drivers WHERE isAvailable = 1')
      .all() as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Driver {
    return new Driver({
      driverId: row.driverId,
      userId: row.userId,
      vehicleInfo: row.vehicleInfo,
      licenseNumber: row.licenseNumber,
      rating: row.rating,
      totalRides: row.totalRides,
      isVerified: row.isVerified === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
