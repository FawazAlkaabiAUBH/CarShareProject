import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RideService } from '../services/ride.service';
import { CreateRideDto, UpdateRideDto } from '../dto/ride.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

@Controller('rides')
@UseGuards(JwtAuthGuard)
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  createRide(@Body() createRideDto: CreateRideDto, @Request() req) {
    return this.rideService.createRideListing(createRideDto, req.user.userId);
  }

  @Public()
  @Get('search')
  searchRides(
    @Query('pickupLocation') pickupLocation?: string,
    @Query('dropoffLocation') dropoffLocation?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // If no search params, return all available rides
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.rideService.getAvailableRides(pickupLocation, dropoffLocation, start, end);
  }

  @Public()
  @Get('driver/:userId')
  getRidesByDriver(@Param('userId', ParseIntPipe) userId: number) {
    return this.rideService.getRidesByDriver(userId);
  }

  @Public()
  @Get(':id')
  getRide(@Param('id', ParseIntPipe) id: number) {
    return this.rideService.getRideById(id);
  }

  @Public()
  @Get()
  getAvailableRides(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.rideService.getAvailableRides(undefined, undefined, start, end);
  }

  @Put(':id')
  updateRide(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRideDto: UpdateRideDto,
    @Request() req,
  ) {
    return this.rideService.updateRideDetails(id, updateRideDto, req.user.userId);
  }

  @Put(':id/cancel')
  cancelRide(@Param('id', ParseIntPipe) id: number, @Request() req) {
    this.rideService.cancelRideListing(id, req.user.userId);
    return { message: 'Ride cancelled successfully' };
  }

  @Put(':id/start')
  startRide(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.rideService.initiateRideSession(id, req.user.userId);
  }

  @Put(':id/complete')
  completeRide(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.rideService.completeRide(id, req.user.userId);
  }

  @Get(':id/seats')
  checkSeats(@Param('id', ParseIntPipe) id: number) {
    const availableSeats = this.rideService.checkSeatAvailability(id);
    return { rideId: id, availableSeats };
  }
}
