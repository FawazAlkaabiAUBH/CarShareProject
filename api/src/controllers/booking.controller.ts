import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto/booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get(':id')
  getBooking(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Get('rider/:riderId')
  getBookingsByRider(@Param('riderId', ParseIntPipe) riderId: number) {
    return this.bookingService.getBookingsByRider(riderId);
  }

  @Get('ride/:rideId')
  getBookingsByRide(@Param('rideId', ParseIntPipe) rideId: number) {
    return this.bookingService.getBookingsByRide(rideId);
  }

  @Put(':id/status')
  updateBookingStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingService.updateBookingStatus(id, updateStatusDto);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  cancelBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelDto: { reason?: string },
  ) {
    return this.bookingService.cancelBooking(id, cancelDto.reason);
  }

  @Post(':id/confirm')
  @HttpCode(200)
  confirmBooking(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.confirmSeatReservation(id);
  }

  @Post(':id/complete')
  @HttpCode(200)
  completeBooking(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.finalizeBooking(id);
  }
}
