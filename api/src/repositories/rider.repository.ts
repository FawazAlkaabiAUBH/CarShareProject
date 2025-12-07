import { Injectable } from '@nestjs/common';
import { Rider } from '../entities/rider.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RiderRepository {
  constructor(private readonly db: DatabaseService) {}

  findByUserId(userId: number): Rider | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM riders WHERE userId = ?')
      .get(userId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findAll(): Rider[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM riders')
      .all() as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  save(rider: Partial<Rider>): Rider {
    const now = new Date().toISOString();

    const existing = rider.userId ? this.findByUserId(rider.userId) : undefined;

    if (!existing) {
      // Insert new rider
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO riders (userId, preferredPickupLocation, rating, totalRides, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        rider.userId,
        rider.preferredPickupLocation ?? null,
        rider.rating ?? 0,
        rider.totalRides ?? 0,
        now,
        now,
      );

      return this.findByUserId(rider.userId!)!;
    } else {
      // Update existing rider
      const stmt = this.db.getDatabase().prepare(`
        UPDATE riders
        SET preferredPickupLocation = ?, rating = ?, totalRides = ?, updatedAt = ?
        WHERE userId = ?
      `);

      stmt.run(
        rider.preferredPickupLocation ?? existing.preferredPickupLocation,
        rider.rating ?? existing.rating,
        rider.totalRides ?? existing.totalRides,
        now,
        rider.userId,
      );

      return this.findByUserId(rider.userId!)!;
    }
  }

  delete(userId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM riders WHERE userId = ?')
      .run(userId);
  }

  updateRating(userId: number, rating: number): void {
    this.db
      .getDatabase()
      .prepare('UPDATE riders SET rating = ?, updatedAt = ? WHERE userId = ?')
      .run(rating, new Date().toISOString(), userId);
  }

  incrementTotalRides(userId: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE riders SET totalRides = totalRides + 1, updatedAt = ? WHERE userId = ?',
      )
      .run(new Date().toISOString(), userId);
  }

  updatePaymentMethod(userId: number, method: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE riders SET updatedAt = ? WHERE userId = ?',
      )
      .run(new Date().toISOString(), userId);
  }

  updatePickupLocation(userId: number, location: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE riders SET preferredPickupLocation = ?, updatedAt = ? WHERE userId = ?',
      )
      .run(location, new Date().toISOString(), userId);
  }

  private mapToEntity(row: any): Rider {
    return new Rider({
      userId: row.userId,
      preferredPickupLocation: row.preferredPickupLocation,
      rating: row.rating,
      totalRides: row.totalRides,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
