import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { RideRepository } from '../repositories/ride.repository';
import { RiderRepository } from '../repositories/rider.repository';
import { UserRepository } from '../repositories/user.repository';
import { NotificationService } from './notification.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto/booking.dto';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly rideRepository: RideRepository,
    private readonly riderRepository: RiderRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
  ) {}

  createBooking(createBookingDto: CreateBookingDto, userId: number): Booking {
    // Verify rider profile exists for this user
    const rider = this.riderRepository.findByUserId(userId);
    if (!rider) {
      throw new NotFoundException(`Rider profile not found for user`);
    }

    // Verify ride exists and has available seats
    const ride = this.rideRepository.findById(createBookingDto.rideId);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${createBookingDto.rideId} not found`);
    }

    if (ride.availableSeats < (createBookingDto.seatsBooked || 1)) {
      throw new BadRequestException('Not enough available seats for this ride');
    }

    // Validate payment method
    if (createBookingDto.paymentMethod === 'BENEFITPAY' && !createBookingDto.benefitPayPhone) {
      throw new BadRequestException('BenefitPay phone number is required for BenefitPay payment method');
    }

    // Check for duplicate booking
    const existingBookings = this.bookingRepository.findByUser(userId);
    const alreadyBooked = existingBookings.some(
      b => b.rideId === createBookingDto.rideId && b.bookingStatus !== 'CANCELLED'
    );
    if (alreadyBooked) {
      throw new BadRequestException('You have already booked this ride');
    }

    // Calculate fare details
    const seatsBooked = createBookingDto.seatsBooked || 1;
    const farePerSeat = ride.farePerSeat;
    const totalAmount = parseFloat((farePerSeat * seatsBooked).toFixed(3));
    const serviceFee = parseFloat((totalAmount * 0.1).toFixed(3)); // 10% service fee
    const driverEarnings = parseFloat((totalAmount - serviceFee).toFixed(3));

    // Create booking
    const booking = this.bookingRepository.save({
      userId,
      rideId: createBookingDto.rideId,
      seatsBooked,
      paymentMethod: createBookingDto.paymentMethod,
      benefitPayPhone: createBookingDto.benefitPayPhone,
      farePerSeat,
      totalAmount,
      serviceFee,
      driverEarnings,
      bookingStatus: 'PENDING',
    });

    // Decrement available seats
    this.rideRepository.decrementSeats(createBookingDto.rideId, seatsBooked);

    // Update ride status if all seats are booked
    const updatedRide = this.rideRepository.findById(createBookingDto.rideId);
    if (updatedRide && updatedRide.availableSeats === 0) {
      this.rideRepository.updateStatus(createBookingDto.rideId, 'BOOKED');
    }

    // Send notification to driver
    const riderUser = this.userRepository.findById(userId);
    const riderName = riderUser ? riderUser.fullName : 'A rider';
    this.notificationService.notifyBookingRequest(
      ride.userId,
      booking.bookingId,
      riderName
    ).catch(err => console.error('Failed to send notification:', err));

    return booking;
  }

  cancelBooking(bookingId: number, userId: number, reason?: string): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Verify the booking belongs to the current user
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (booking.bookingStatus === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    // Increment seats back
    this.rideRepository.incrementSeats(booking.rideId, booking.seatsBooked);

    // Cancel booking
    this.bookingRepository.setCancellationReason(
      bookingId,
      reason || 'Cancelled by user',
      userId,
    );

    this.bookingRepository.updateStatus(bookingId, 'CANCELLED');

    // Update ride status back to available
    this.rideRepository.updateStatus(booking.rideId, 'AVAILABLE');

    const updatedBooking = this.bookingRepository.findById(bookingId);
    if (!updatedBooking) {
      throw new NotFoundException(`Failed to retrieve booking with ID ${bookingId}`);
    }
    return updatedBooking;
  }

  updateBookingStatus(
    bookingId: number,
    updateStatusDto: UpdateBookingStatusDto,
    userId: number,
  ): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Verify the booking belongs to the current user
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    if (updateStatusDto.status === 'CANCELLED') {
      return this.cancelBooking(bookingId, userId, updateStatusDto.cancellationReason);
    }

    this.bookingRepository.updateStatus(bookingId, updateStatusDto.status);
    
    // Send notification when booking is confirmed
    if (updateStatusDto.status === 'CONFIRMED') {
      const ride = this.rideRepository.findById(booking.rideId);
      if (ride) {
        const driverUser = this.userRepository.findById(ride.userId);
        const driverName = driverUser ? driverUser.fullName : 'The driver';
        this.notificationService.notifyBookingConfirmed(
          booking.userId,
          bookingId,
          driverName
        ).catch(err => console.error('Failed to send notification:', err));
      }
    }
    
    const updatedBooking = this.bookingRepository.findById(bookingId);
    if (!updatedBooking) {
      throw new NotFoundException(`Failed to retrieve booking with ID ${bookingId}`);
    }
    return updatedBooking;
  }

  getBookingsByUser(userId: number): Booking[] {
    return this.bookingRepository.findByUser(userId);
  }

  getBookingsByRide(rideId: number): Booking[] {
    return this.bookingRepository.findByRide(rideId);
  }

  getBookingById(bookingId: number): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    return booking;
  }
}
