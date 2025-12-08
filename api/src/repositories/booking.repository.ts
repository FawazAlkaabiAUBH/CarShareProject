import { Injectable } from '@nestjs/common';
import { Booking } from '../entities/booking.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookingRepository {
  constructor(private readonly db: DatabaseService) {}

  findById(bookingId: number): Booking | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM bookings WHERE bookingId = ?')
      .get(bookingId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByRide(rideId: number): Booking[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM bookings WHERE rideId = ?')
      .all(rideId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findByUser(userId: number): Booking[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM bookings WHERE userId = ?')
      .all(userId) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  findAll(): Booking[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM bookings')
      .all() as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  save(booking: Partial<Booking>): Booking {
    const now = new Date().toISOString();

    if (!booking.bookingId) {
      // Insert new booking
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO bookings (
          rideId, userId, seatsBooked, paymentMethod, benefitPayPhone,
          farePerSeat, totalAmount, serviceFee, driverEarnings,
          bookingStatus, createdAt, updatedAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        booking.rideId,
        booking.userId,
        booking.seatsBooked!,
        booking.paymentMethod!,
        booking.benefitPayPhone || null,
        booking.farePerSeat!,
        booking.totalAmount!,
        booking.serviceFee!,
        booking.driverEarnings!,
        booking.bookingStatus || 'PENDING',
        now,
        now,
      );

      return this.findById(info.lastInsertRowid as number)!;
    } else {
      // Update existing booking
      const stmt = this.db.getDatabase().prepare(`
        UPDATE bookings
        SET rideId = ?, userId = ?, seatsBooked = ?, paymentMethod = ?, benefitPayPhone = ?,
            farePerSeat = ?, totalAmount = ?, serviceFee = ?, driverEarnings = ?,
            bookingStatus = ?, updatedAt = ?
        WHERE bookingId = ?
      `);

      stmt.run(
        booking.rideId,
        booking.userId,
        booking.seatsBooked!,
        booking.paymentMethod!,
        booking.benefitPayPhone || null,
        booking.farePerSeat!,
        booking.totalAmount!,
        booking.serviceFee!,
        booking.driverEarnings!,
        booking.bookingStatus,
        now,
        booking.bookingId,
      );

      return this.findById(booking.bookingId)!;
    }
  }

  delete(bookingId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM bookings WHERE bookingId = ?')
      .run(bookingId);
  }

  updateStatus(bookingId: number, status: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE bookings SET bookingStatus = ?, updatedAt = ? WHERE bookingId = ?',
      )
      .run(status, new Date().toISOString(), bookingId);
  }

  setCancellationReason(
    bookingId: number,
    reason: string,
    cancelledBy: number,
  ): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE bookings SET cancellationReason = ?, cancelledBy = ?, updatedAt = ? WHERE bookingId = ?',
      )
      .run(reason, cancelledBy, new Date().toISOString(), bookingId);
  }

  markCompleted(bookingId: number, completedAt: Date): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE bookings SET bookingStatus = ?, completedAt = ?, updatedAt = ? WHERE bookingId = ?',
      )
      .run('COMPLETED', completedAt.toISOString(), new Date().toISOString(), bookingId);
  }

  private mapToEntity(row: any): Booking {
    return new Booking({
      bookingId: row.bookingId,
      rideId: row.rideId,
      userId: row.userId,
      seatsBooked: row.seatsBooked,
      paymentMethod: row.paymentMethod,
      benefitPayPhone: row.benefitPayPhone,
      farePerSeat: row.farePerSeat,
      totalAmount: row.totalAmount,
      serviceFee: row.serviceFee,
      driverEarnings: row.driverEarnings,
      bookingStatus: row.bookingStatus,
      cancellationReason: row.cancellationReason,
      cancelledBy: row.cancelledBy,
      completedAt: row.completedAt ? new Date(row.completedAt) : undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
