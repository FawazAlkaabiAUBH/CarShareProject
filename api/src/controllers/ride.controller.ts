import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RideService } from '../services/ride.service';
import { CreateRideDto, UpdateRideDto } from '../dto/ride.dto';

@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  createRide(@Body() createRideDto: CreateRideDto) {
    return this.rideService.createRideListing(createRideDto);
  }

  @Get('search')
  searchRides(
    @Query('pickupLocation') pickupLocation?: string,
    @Query('dropoffLocation') dropoffLocation?: string,
  ) {
    if (!pickupLocation && !dropoffLocation) {
      return { message: 'Please provide at least one search parameter' };
    }
    return this.rideService.getAvailableRides(pickupLocation);
  }

  @Get('driver/:driverId')
  getRidesByDriver(@Param('driverId', ParseIntPipe) driverId: number) {
    return this.rideService.getRidesByDriver(driverId);
  }

  @Get(':id')
  getRide(@Param('id', ParseIntPipe) id: number) {
    return this.rideService.getRideById(id);
  }

  @Get()
  getAvailableRides() {
    return this.rideService.getAvailableRides();
  }

  @Put(':id')
  updateRide(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRideDto: UpdateRideDto,
  ) {
    return this.rideService.updateRideDetails(id, updateRideDto);
  }

  @Put(':id/cancel')
  cancelRide(@Param('id', ParseIntPipe) id: number) {
    this.rideService.cancelRideListing(id);
    return { message: 'Ride cancelled successfully' };
  }

  @Put(':id/start')
  startRide(@Param('id', ParseIntPipe) id: number) {
    return this.rideService.initiateRideSession(id);
  }

  @Put(':id/complete')
  completeRide(@Param('id', ParseIntPipe) id: number) {
    return this.rideService.completeRide(id);
  }

  @Get(':id/seats')
  checkSeats(@Param('id', ParseIntPipe) id: number) {
    const availableSeats = this.rideService.checkSeatAvailability(id);
    return { rideId: id, availableSeats };
  }
}
