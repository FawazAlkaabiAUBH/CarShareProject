import { Injectable } from '@nestjs/common';
import { Rider } from '../entities/rider.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RiderRepository {
  constructor(private readonly db: DatabaseService) {}

  findById(riderId: number): Rider | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM riders WHERE riderId = ?')
      .get(riderId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

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

    if (!rider.riderId) {
      // Insert new rider
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO riders (userId, preferredPickupLocation, rating, totalRides, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        rider.userId,
        rider.preferredPickupLocation ?? null,
        rider.rating ?? 0,
        rider.totalRides ?? 0,
        now,
        now,
      );

      return this.findById(info.lastInsertRowid as number)!;
    } else {
      // Update existing rider
      const stmt = this.db.getDatabase().prepare(`
        UPDATE riders
        SET userId = ?, preferredPickupLocation = ?, rating = ?, totalRides = ?, updatedAt = ?
        WHERE riderId = ?
      `);

      stmt.run(
        rider.userId,
        rider.preferredPickupLocation ?? null,
        rider.rating!,
        rider.totalRides!,
        now,
        rider.riderId,
      );

      return this.findById(rider.riderId)!;
    }
  }

  delete(riderId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM riders WHERE riderId = ?')
      .run(riderId);
  }

  updateRating(riderId: number, rating: number): void {
    this.db
      .getDatabase()
      .prepare('UPDATE riders SET rating = ?, updatedAt = ? WHERE riderId = ?')
      .run(rating, new Date().toISOString(), riderId);
  }

  incrementTotalRides(riderId: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE riders SET totalRides = totalRides + 1, updatedAt = ? WHERE riderId = ?',
      )
      .run(new Date().toISOString(), riderId);
  }

  updatePaymentMethod(riderId: number, method: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE riders SET paymentMethod = ?, updatedAt = ? WHERE riderId = ?',
      )
      .run(method, new Date().toISOString(), riderId);
  }

  updatePickupLocation(riderId: number, location: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE riders SET preferredPickupLocation = ?, updatedAt = ? WHERE riderId = ?',
      )
      .run(location, new Date().toISOString(), riderId);
  }

  incrementLoyaltyPoints(riderId: number, points: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE riders SET loyaltyPoints = loyaltyPoints + ?, updatedAt = ? WHERE riderId = ?',
      )
      .run(points, new Date().toISOString(), riderId);
  }

  private mapToEntity(row: any): Rider {
    return new Rider({
      riderId: row.riderId,
      userId: row.userId,
      preferredPickupLocation: row.preferredPickupLocation,
      rating: row.rating,
      totalRides: row.totalRides,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
