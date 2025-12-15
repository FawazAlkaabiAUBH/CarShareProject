import { Injectable } from '@nestjs/common';
import { Rating } from '../entities/rating.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RatingRepository {
  constructor(private readonly db: DatabaseService) {}

  findById(ratingId: number): Rating | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM ratings WHERE ratingId = ?')
      .get(ratingId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByRide(rideId: number): Rating[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM ratings WHERE rideId = ?')
      .all(rideId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findAll(): Rating[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM ratings')
      .all() as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  save(rating: Partial<Rating>): Rating {
    const now = new Date().toISOString();

    if (!rating.ratingId) {
      // Insert new rating
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO ratings (rideId, raterId, rateeId, score, comment, isFlagged, feedbackTags, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        rating.rideId,
        rating.raterId!,
        rating.rateeId!,
        rating.score,
        rating.comment ?? null,
        rating.isFlagged ?? false ? 1 : 0,
        rating.feedbackTags ? JSON.stringify(rating.feedbackTags) : '[]',
        now,
        now,
      );

      return this.findById(info.lastInsertRowid as number)!;
    } else {
      // Update existing rating
      const stmt = this.db.getDatabase().prepare(`
        UPDATE ratings
        SET rideId = ?, raterId = ?, rateeId = ?, score = ?, comment = ?, isFlagged = ?, feedbackTags = ?, updatedAt = ?
        WHERE ratingId = ?
      `);

      stmt.run(
        rating.rideId,
        rating.raterId!,
        rating.rateeId!,
        rating.score,
        rating.comment ?? null,
        rating.isFlagged! ? 1 : 0,
        rating.feedbackTags ? JSON.stringify(rating.feedbackTags) : '[]',
        now,
        rating.ratingId,
      );

      return this.findById(rating.ratingId)!;
    }
  }

  delete(ratingId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM ratings WHERE ratingId = ?')
      .run(ratingId);
  }

  flag(ratingId: number, isFlagged: boolean): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE ratings SET isFlagged = ?, updatedAt = ? WHERE ratingId = ?',
      )
      .run(isFlagged ? 1 : 0, new Date().toISOString(), ratingId);
  }

  updateScoreAndComment(
    ratingId: number,
    score: number,
    comment: string,
  ): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE ratings SET score = ?, comment = ?, updatedAt = ? WHERE ratingId = ?',
      )
      .run(score, comment, new Date().toISOString(), ratingId);
  }

  findByUser(userId: number): Rating[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM ratings WHERE raterId = ?')
      .all(userId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findForUser(userId: number): Rating[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM ratings WHERE rateeId = ?')
      .all(userId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  getAverageForUser(userId: number): number {
    const result = this.db
      .getDatabase()
      .prepare('SELECT AVG(score) as avg FROM ratings WHERE rateeId = ?')
      .get(userId) as any;

    return result?.avg || 0;
  }

  private mapToEntity(row: any): Rating {
    return new Rating({
      ratingId: row.ratingId,
      rideId: row.rideId,
      raterId: row.raterId,
      rateeId: row.rateeId,
      score: row.score,
      comment: row.comment,
      isFlagged: row.isFlagged === 1,
      feedbackTags: row.feedbackTags ? JSON.parse(row.feedbackTags) : '[]',
      createdAt: new Date(row.createdAt),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    });
  }
}
