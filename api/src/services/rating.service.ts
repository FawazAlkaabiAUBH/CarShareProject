import { Injectable } from '@nestjs/common';
import { RatingRepository } from '../repositories/rating.repository';
import { CreateRatingDto, UpdateRatingDto } from '../dto/rating.dto';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  submitRating(createRatingDto: CreateRatingDto): Rating {
    // Validate score is between 1 and 5
    if (!this.validateRatingScore(createRatingDto.score)) {
      throw new Error('Rating score must be between 1 and 5');
    }

    const ratingData = {
      ...createRatingDto,
      feedbackTags: createRatingDto.feedbackTags ? JSON.stringify(createRatingDto.feedbackTags) : undefined,
    };

    return this.ratingRepository.save(ratingData as any);
  }

  updateRating(ratingId: number, updateRatingDto: UpdateRatingDto): Rating {
    const rating = this.ratingRepository.findById(ratingId);
    if (!rating) {
      throw new Error(`Rating with ID ${ratingId} not found`);
    }

    if (updateRatingDto.score && !this.validateRatingScore(updateRatingDto.score)) {
      throw new Error('Rating score must be between 1 and 5');
    }

    const updateData = {
      ...updateRatingDto,
      feedbackTags: updateRatingDto.feedbackTags ? JSON.stringify(updateRatingDto.feedbackTags) : undefined,
    };

    return this.ratingRepository.save({ ...rating, ...updateData } as any);
  }

  deleteRating(ratingId: number): void {
    this.ratingRepository.delete(ratingId);
  }

  validateRatingScore(score: number): boolean {
    return score >= 1 && score <= 5;
  }

  computeUserAverage(userId: number): number {
    return this.ratingRepository.getAverageForUser(userId);
  }

  getRatingsByUser(userId: number): Rating[] {
    return this.ratingRepository.findByUser(userId);
  }

  getRatingsForUser(userId: number): Rating[] {
    return this.ratingRepository.findForUser(userId);
  }

  getRatingsByRide(rideId: number): Rating[] {
    return this.ratingRepository.findByRide(rideId);
  }

  getRatingById(ratingId: number): Rating {
    const rating = this.ratingRepository.findById(ratingId);
    if (!rating) {
      throw new Error(`Rating with ID ${ratingId} not found`);
    }
    return rating;
  }
}
