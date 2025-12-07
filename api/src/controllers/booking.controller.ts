import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  createBooking(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingService.createBooking(createBookingDto, req.user.userId);
  }

  @Get(':id')
  getBooking(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Get('my')
  getMyBookings(@Request() req) {
    return this.bookingService.getBookingsByUser(req.user.userId);
  }

  @Get('ride/:rideId')
  getBookingsByRide(@Param('rideId', ParseIntPipe) rideId: number) {
    return this.bookingService.getBookingsByRide(rideId);
  }

  @Get('user/:userId')
  getBookingsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.bookingService.getBookingsByUser(userId);
  }

  @Put(':id/status')
  updateBookingStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateBookingStatusDto,
    @Request() req,
  ) {
    return this.bookingService.updateBookingStatus(id, updateStatusDto, req.user.userId);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  cancelBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelDto: { reason?: string },
    @Request() req,
  ) {
    return this.bookingService.cancelBooking(id, req.user.userId, cancelDto.reason);
  }
}
