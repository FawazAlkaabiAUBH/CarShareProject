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

    return this.ratingRepository.save(createRatingDto);
  }

  updateRating(ratingId: number, updateRatingDto: UpdateRatingDto): Rating {
    const rating = this.ratingRepository.findById(ratingId);
    if (!rating) {
      throw new Error(`Rating with ID ${ratingId} not found`);
    }

    if (updateRatingDto.score && !this.validateRatingScore(updateRatingDto.score)) {
      throw new Error('Rating score must be between 1 and 5');
    }

    return this.ratingRepository.save({ ...rating, ...updateRatingDto });
  }

  deleteRating(ratingId: number): void {
    this.ratingRepository.delete(ratingId);
  }

  validateRatingScore(score: number): boolean {
    return score >= 1 && score <= 5;
  }

  computeDriverAverage(driverId: number): number {
    return this.ratingRepository.getAverageForDriver(driverId);
  }

  computeRiderAverage(riderId: number): number {
    return this.ratingRepository.getAverageForRider(riderId);
  }

  getRatingsByDriver(driverId: number): Rating[] {
    return this.ratingRepository.findByDriver(driverId);
  }

  getRatingsByRider(riderId: number): Rating[] {
    return this.ratingRepository.findByRider(riderId);
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
