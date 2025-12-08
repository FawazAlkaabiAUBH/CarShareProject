import { Injectable } from '@nestjs/common';
import { Vehicle } from '../entities/vehicle.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class VehicleRepository {
  constructor(private readonly db: DatabaseService) {}

  findById(vehicleId: number): Vehicle | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM vehicles WHERE vehicleId = ?')
      .get(vehicleId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByUserId(userId: number): Vehicle[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM vehicles WHERE userId = ? AND isActive = 1')
      .all(userId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findAllByUserId(userId: number): Vehicle[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM vehicles WHERE userId = ?')
      .all(userId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findActiveByUserId(userId: number): Vehicle[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM vehicles WHERE userId = ? AND isActive = 1')
      .all(userId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  save(vehicle: Partial<Vehicle>): Vehicle {
    const now = new Date().toISOString();

    if (vehicle.vehicleId) {
      // Update existing
      this.db
        .getDatabase()
        .prepare(
          `UPDATE vehicles 
           SET make = ?, model = ?, year = ?, color = ?, plateNumber = ?, 
               vehicleDocument = ?, isActive = ?, updatedAt = ?
           WHERE vehicleId = ?`,
        )
        .run(
          vehicle.make,
          vehicle.model,
          vehicle.year,
          vehicle.color,
          vehicle.plateNumber,
          vehicle.vehicleDocument || null,
          vehicle.isActive ? 1 : 0,
          now,
          vehicle.vehicleId,
        );

      return this.findById(vehicle.vehicleId)!;
    } else {
      // Insert new
      const result = this.db
        .getDatabase()
        .prepare(
          `INSERT INTO vehicles (userId, make, model, year, color, plateNumber, vehicleDocument, isActive, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          vehicle.userId,
          vehicle.make,
          vehicle.model,
          vehicle.year,
          vehicle.color,
          vehicle.plateNumber,
          vehicle.vehicleDocument || null,
          vehicle.isActive !== undefined ? (vehicle.isActive ? 1 : 0) : 1,
          now,
          now,
        );

      return this.findById(result.lastInsertRowid as number)!;
    }
  }

  deactivate(vehicleId: number): void {
    const now = new Date().toISOString();
    this.db
      .getDatabase()
      .prepare('UPDATE vehicles SET isActive = 0, updatedAt = ? WHERE vehicleId = ?')
      .run(now, vehicleId);
  }

  delete(vehicleId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM vehicles WHERE vehicleId = ?')
      .run(vehicleId);
  }

  private mapToEntity(row: any): Vehicle {
    return new Vehicle({
      vehicleId: row.vehicleId,
      userId: row.userId,
      make: row.make,
      model: row.model,
      year: row.year,
      color: row.color,
      plateNumber: row.plateNumber,
      vehicleDocument: row.vehicleDocument,
      isActive: row.isActive === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
