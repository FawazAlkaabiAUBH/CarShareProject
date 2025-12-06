import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { RideRepository } from '../repositories/ride.repository';
import { RiderRepository } from '../repositories/rider.repository';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto/booking.dto';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly rideRepository: RideRepository,
    private readonly riderRepository: RiderRepository,
  ) {}

  createBooking(createBookingDto: CreateBookingDto): Booking {
    // Verify rider exists
    const rider = this.riderRepository.findById(createBookingDto.riderId);
    if (!rider) {
      throw new Error(`Rider with ID ${createBookingDto.riderId} not found`);
    }

    // Verify ride exists and has available seats
    const ride = this.rideRepository.findById(createBookingDto.rideId);
    if (!ride) {
      throw new Error(`Ride with ID ${createBookingDto.rideId} not found`);
    }

    if (ride.availableSeats <= 0) {
      throw new Error('No available seats for this ride');
    }

    // Create booking
    const booking = this.bookingRepository.save({
      riderId: createBookingDto.riderId,
      driverId: ride.driverId,
      rideId: createBookingDto.rideId,
      bookingStatus: 'PENDING',
    });

    // Decrement available seats
    this.rideRepository.decrementSeats(createBookingDto.rideId);

    // Update ride status if all seats are booked
    if (ride.availableSeats === 1) {
      // Was 1, now 0
      this.rideRepository.updateStatus(createBookingDto.rideId, 'BOOKED');
    }

    return booking;
  }

  cancelBooking(bookingId: number, reason?: string): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    // Increment seats back
    this.rideRepository.incrementSeats(booking.rideId);

    // Cancel booking
    this.bookingRepository.setCancellationReason(
      bookingId,
      reason || 'Cancelled by user',
    );

    // Update ride status back to available
    this.rideRepository.updateStatus(booking.rideId, 'AVAILABLE');

    const updatedBooking = this.bookingRepository.findById(bookingId);
    if (!updatedBooking) {
      throw new Error(`Failed to retrieve booking with ID ${bookingId}`);
    }
    return updatedBooking;
  }

  updateBookingStatus(
    bookingId: number,
    updateStatusDto: UpdateBookingStatusDto,
  ): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    if (updateStatusDto.status === 'CANCELLED') {
      return this.cancelBooking(bookingId, updateStatusDto.cancellationReason);
    }

    this.bookingRepository.updateStatus(bookingId, updateStatusDto.status);
    const updatedBooking = this.bookingRepository.findById(bookingId);
    if (!updatedBooking) {
      throw new Error(`Failed to retrieve booking with ID ${bookingId}`);
    }
    return updatedBooking;
  }

  getBookingsByRider(riderId: number): Booking[] {
    return this.bookingRepository.findByRider(riderId);
  }

  getBookingsByRide(rideId: number): Booking[] {
    return this.bookingRepository.findByRide(rideId);
  }

  getBookingById(bookingId: number): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }
    return booking;
  }

  confirmSeatReservation(bookingId: number): Booking {
    this.bookingRepository.updateStatus(bookingId, 'CONFIRMED');
    
    // Award loyalty points
    const booking = this.bookingRepository.findById(bookingId);
    if (booking) {
      this.riderRepository.incrementLoyaltyPoints(booking.riderId, 10);
    }
    
    const updatedBooking = this.bookingRepository.findById(bookingId);
    if (!updatedBooking) {
      throw new Error(`Failed to retrieve booking with ID ${bookingId}`);
    }
    return updatedBooking;
  }

  finalizeBooking(bookingId: number): Booking {
    this.bookingRepository.markCompleted(bookingId, new Date());
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error(`Failed to retrieve booking with ID ${bookingId}`);
    }
    return booking;
  }
}
