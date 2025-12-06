import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let createdBookingId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/bookings (POST)', () => {
    it('should create a new booking', () => {
      const newBooking = {
        riderId: 1,
        rideId: 1,
      };

      return request(app.getHttpServer())
        .post('/bookings')
        .send(newBooking)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('bookingId');
          expect(res.body.riderId).toBe(newBooking.riderId);
          expect(res.body.rideId).toBe(newBooking.rideId);
          expect(res.body.bookingStatus).toBe('PENDING');
          createdBookingId = res.body.bookingId;
        });
    });
  });

  describe('/bookings/:id (GET)', () => {
    it('should return a booking by id', async () => {
      // First create a booking
      const newBooking = { riderId: 1, rideId: 1 };
      const createRes = await request(app.getHttpServer())
        .post('/bookings')
        .send(newBooking);
      const bookingId = createRes.body.bookingId;

      return request(app.getHttpServer())
        .get(`/bookings/${bookingId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('bookingId');
          expect(res.body).toHaveProperty('riderId');
          expect(res.body).toHaveProperty('rideId');
        });
    });
  });

  describe('/bookings/:id/status (PUT)', () => {
    it('should update booking status', async () => {
      const newBooking = { riderId: 1, rideId: 1 };
      const createRes = await request(app.getHttpServer())
        .post('/bookings')
        .send(newBooking);
      const bookingId = createRes.body.bookingId;

      const statusUpdate = { status: 'CONFIRMED' };
      return request(app.getHttpServer())
        .put(`/bookings/${bookingId}/status`)
        .send(statusUpdate)
        .expect(200)
        .expect((res) => {
          expect(res.body.bookingStatus).toBe(statusUpdate.status);
        });
    });
  });

  describe('/bookings/:id/cancel (POST)', () => {
    it('should cancel a booking', async () => {
      const newBooking = { riderId: 1, rideId: 1 };
      const createRes = await request(app.getHttpServer())
        .post('/bookings')
        .send(newBooking);
      const bookingId = createRes.body.bookingId;

      const cancelData = { reason: 'Change of plans' };
      return request(app.getHttpServer())
        .post(`/bookings/${bookingId}/cancel`)
        .send(cancelData)
        .expect(200)
        .expect((res) => {
          expect(res.body.bookingStatus).toBe('CANCELLED');
          expect(res.body.cancellationReason).toBe(cancelData.reason);
        });
    });
  });

  describe('/bookings/:id/confirm (POST)', () => {
    it('should confirm a booking reservation', async () => {
      const newBooking = { riderId: 1, rideId: 1 };
      const createRes = await request(app.getHttpServer())
        .post('/bookings')
        .send(newBooking);
      const bookingId = createRes.body.bookingId;

      return request(app.getHttpServer())
        .post(`/bookings/${bookingId}/confirm`)
        .expect(200)
        .expect((res) => {
          expect(res.body.bookingStatus).toBe('CONFIRMED');
        });
    });
  });

  describe('/bookings/:id/complete (POST)', () => {
    it('should finalize a booking', async () => {
      const newBooking = { riderId: 1, rideId: 1 };
      const createRes = await request(app.getHttpServer())
        .post('/bookings')
        .send(newBooking);
      const bookingId = createRes.body.bookingId;

      return request(app.getHttpServer())
        .post(`/bookings/${bookingId}/complete`)
        .expect(200)
        .expect((res) => {
          expect(res.body.bookingStatus).toBe('COMPLETED');
          expect(res.body).toHaveProperty('completedAt');
        });
    });
  });

  describe('/bookings/rider/:riderId (GET)', () => {
    it('should return bookings by rider', () => {
      return request(app.getHttpServer())
        .get('/bookings/rider/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/bookings/ride/:rideId (GET)', () => {
    it('should return bookings by ride', () => {
      return request(app.getHttpServer())
        .get('/bookings/ride/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
