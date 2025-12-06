import { Injectable } from '@nestjs/common';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingRepository {
  private ratings: Map<number, Rating> = new Map();
  private currentId = 1;

  findById(ratingId: number): Rating | undefined {
    return this.ratings.get(ratingId);
  }

  findByDriver(driverId: number): Rating[] {
    return Array.from(this.ratings.values()).filter(
      (r) => r.driverId === driverId,
    );
  }

  findByRider(riderId: number): Rating[] {
    return Array.from(this.ratings.values()).filter(
      (r) => r.riderId === riderId,
    );
  }

  findByRide(rideId: number): Rating[] {
    return Array.from(this.ratings.values()).filter(
      (r) => r.rideId === rideId,
    );
  }

  save(rating: Partial<Rating>): Rating {
    if (!rating.ratingId) {
      rating.ratingId = this.currentId++;
      rating.createdAt = new Date();
      rating.isFlagged = rating.isFlagged || false;
      rating.feedbackTags = rating.feedbackTags || [];
    }
    rating.updatedAt = new Date();

    const fullRating = new Rating(rating as Rating);
    this.ratings.set(fullRating.ratingId, fullRating);
    return fullRating;
  }

  delete(ratingId: number): void {
    this.ratings.delete(ratingId);
  }

  flag(ratingId: number, isFlagged: boolean): void {
    const rating = this.ratings.get(ratingId);
    if (rating) {
      rating.isFlagged = isFlagged;
      rating.updatedAt = new Date();
    }
  }

  updateScoreAndComment(ratingId: number, score: number, comment: string): void {
    const rating = this.ratings.get(ratingId);
    if (rating) {
      rating.score = score;
      rating.comment = comment;
      rating.updatedAt = new Date();
    }
  }

  storeFeedbackTags(ratingId: number, tags: string[]): void {
    const rating = this.ratings.get(ratingId);
    if (rating) {
      rating.feedbackTags = tags;
      rating.updatedAt = new Date();
    }
  }

  getAverageForDriver(driverId: number): number {
    const ratings = this.findByDriver(driverId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.score, 0);
    return sum / ratings.length;
  }

  getAverageForRider(riderId: number): number {
    const ratings = this.findByRider(riderId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.score, 0);
    return sum / ratings.length;
  }
}
