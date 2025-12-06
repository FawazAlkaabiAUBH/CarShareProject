import { Injectable } from '@nestjs/common';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingRepository {
  private bookings: Map<number, Booking> = new Map();
  private currentId = 1;

  findById(bookingId: number): Booking | undefined {
    return this.bookings.get(bookingId);
  }

  findByRider(riderId: number): Booking[] {
    return Array.from(this.bookings.values()).filter(
      (b) => b.riderId === riderId,
    );
  }

  findByRide(rideId: number): Booking[] {
    return Array.from(this.bookings.values()).filter(
      (b) => b.rideId === rideId,
    );
  }

  findActiveByRider(riderId: number): Booking[] {
    return Array.from(this.bookings.values()).filter(
      (b) =>
        b.riderId === riderId &&
        (b.bookingStatus === 'PENDING' || b.bookingStatus === 'CONFIRMED'),
    );
  }

  save(booking: Partial<Booking>): Booking {
    if (!booking.bookingId) {
      booking.bookingId = this.currentId++;
      booking.createdAt = new Date();
      booking.bookingStatus = booking.bookingStatus || 'PENDING';
      booking.bookingTime = booking.bookingTime || new Date();
    }
    booking.updatedAt = new Date();

    const fullBooking = new Booking(booking as Booking);
    this.bookings.set(fullBooking.bookingId, fullBooking);
    return fullBooking;
  }

  delete(bookingId: number): void {
    this.bookings.delete(bookingId);
  }

  updateStatus(bookingId: number, status: Booking['bookingStatus']): void {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.bookingStatus = status;
      booking.updatedAt = new Date();

      if (status === 'CONFIRMED' && !booking.assignedTime) {
        booking.assignedTime = new Date();
      } else if (status === 'COMPLETED' && !booking.completedTime) {
        booking.completedTime = new Date();
      }
    }
  }

  assignDriver(bookingId: number, driverId: number): void {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.driverId = driverId;
      booking.assignedTime = new Date();
      booking.updatedAt = new Date();
    }
  }

  markCompleted(bookingId: number, completedTime: Date): void {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.completedTime = completedTime;
      booking.bookingStatus = 'COMPLETED';
      booking.updatedAt = new Date();
    }
  }

  setCancellationReason(bookingId: number, reason: string): void {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.cancellationReason = reason;
      booking.bookingStatus = 'CANCELLED';
      booking.updatedAt = new Date();
    }
  }
}
