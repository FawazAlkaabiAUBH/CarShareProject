import { Injectable } from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DriverRepository {
  constructor(private readonly db: DatabaseService) {}

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
      .prepare('SELECT * FROM drivers WHERE verifiedAt IS NOT NULL')
      .all() as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findPending(): Driver[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM drivers WHERE verifiedAt IS NULL')
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

    const existing = driver.userId ? this.findByUserId(driver.userId) : undefined;

    if (!existing) {
      // Insert new driver
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO drivers (userId, licenseNumber, licenseDocument, rating, totalRides, verifiedAt, verifiedBy, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        driver.userId,
        driver.licenseNumber,
        driver.licenseDocument ?? null,
        driver.rating ?? 0,
        driver.totalRides ?? 0,
        driver.verifiedAt ? driver.verifiedAt.toISOString() : null,
        driver.verifiedBy ?? null,
        now,
        now,
      );

      return this.findByUserId(driver.userId!)!;
    } else {
      // Update existing driver
      const stmt = this.db.getDatabase().prepare(`
        UPDATE drivers
        SET licenseNumber = ?, licenseDocument = ?, rating = ?, totalRides = ?, verifiedAt = ?, verifiedBy = ?, updatedAt = ?
        WHERE userId = ?
      `);

      stmt.run(
        driver.licenseNumber ?? existing.licenseNumber,
        driver.licenseDocument ?? existing.licenseDocument,
        driver.rating ?? existing.rating,
        driver.totalRides ?? existing.totalRides,
        driver.verifiedAt ? driver.verifiedAt.toISOString() : existing.verifiedAt?.toISOString() ?? null,
        driver.verifiedBy ?? existing.verifiedBy,
        now,
        driver.userId,
      );

      return this.findByUserId(driver.userId!)!;
    }
  }

  delete(userId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM drivers WHERE userId = ?')
      .run(userId);
  }

  updateRating(userId: number, rating: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET rating = ?, updatedAt = ? WHERE userId = ?',
      )
      .run(rating, new Date().toISOString(), userId);
  }

  incrementTotalRides(userId: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET totalRides = totalRides + 1, updatedAt = ? WHERE userId = ?',
      )
      .run(new Date().toISOString(), userId);
  }

  verify(userId: number, verifiedBy: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE drivers SET verifiedAt = ?, verifiedBy = ?, updatedAt = ? WHERE userId = ?',
      )
      .run(new Date().toISOString(), verifiedBy, new Date().toISOString(), userId);
  }

  updateLicense(userId: number, licenseNumber: string, licenseDocument?: string): void {
    const stmt = licenseDocument 
      ? this.db.getDatabase().prepare('UPDATE drivers SET licenseNumber = ?, licenseDocument = ?, updatedAt = ? WHERE userId = ?')
      : this.db.getDatabase().prepare('UPDATE drivers SET licenseNumber = ?, updatedAt = ? WHERE userId = ?');
    
    if (licenseDocument) {
      stmt.run(licenseNumber, licenseDocument, new Date().toISOString(), userId);
    } else {
      stmt.run(licenseNumber, new Date().toISOString(), userId);
    }
  }

  private mapToEntity(row: any): Driver {
    return new Driver({
      userId: row.userId,
      licenseNumber: row.licenseNumber,
      licenseDocument: row.licenseDocument,
      isVerified: !!row.isVerified,
      rating: row.rating,
      totalRides: row.totalRides,
      verifiedAt: row.verifiedAt ? new Date(row.verifiedAt) : undefined,
      verifiedBy: row.verifiedBy,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
