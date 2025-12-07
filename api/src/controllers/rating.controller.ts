import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { RatingService } from '../services/rating.service';
import { CreateRatingDto, UpdateRatingDto } from '../dto/rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  createRating(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.submitRating(createRatingDto);
  }

  @Get('user/:userId/average')
  getUserAverage(@Param('userId', ParseIntPipe) userId: number) {
    const averageRating = this.ratingService.computeUserAverage(userId);
    return { averageRating };
  }

  @Get('user/:userId/given')
  getRatingsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ratingService.getRatingsByUser(userId);
  }

  @Get('user/:userId/received')
  getRatingsForUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ratingService.getRatingsForUser(userId);
  }

  @Get('ride/:rideId')
  getRideRatings(@Param('rideId', ParseIntPipe) rideId: number) {
    return this.ratingService.getRatingsByRide(rideId);
  }

  @Get(':id')
  getRating(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.getRatingById(id);
  }

  @Put(':id')
  updateRating(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingService.updateRating(id, updateRatingDto);
  }

  @Delete(':id')
  deleteRating(@Param('id', ParseIntPipe) id: number) {
    this.ratingService.deleteRating(id);
    return { message: 'Rating deleted successfully' };
  }
}
