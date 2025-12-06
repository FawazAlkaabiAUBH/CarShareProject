import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RideController (e2e)', () => {
  let app: INestApplication;
  let createdRideId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/rides (POST)', () => {
    it('should create a new ride', () => {
      const newRide = {
        driverId: 1,
        pickupLocation: 'AUBH Campus',
        dropoffLocation: 'Manama City Centre',
        pickupTime: new Date(Date.now() + 3600000).toISOString(),
        availableSeats: 3,
        fareEstimate: 5.0,
      };

      return request(app.getHttpServer())
        .post('/rides')
        .send(newRide)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('rideId');
          expect(res.body.pickupLocation).toBe(newRide.pickupLocation);
          expect(res.body.rideStatus).toBe('AVAILABLE');
          createdRideId = res.body.rideId;
        });
    });
  });

  describe('/rides (GET)', () => {
    it('should return all rides', () => {
      return request(app.getHttpServer())
        .get('/rides')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/rides/:id (GET)', () => {
    it('should return a ride by id', () => {
      return request(app.getHttpServer())
        .get('/rides/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('rideId', 1);
          expect(res.body).toHaveProperty('pickupLocation');
          expect(res.body).toHaveProperty('dropoffLocation');
        });
    });
  });

  describe('/rides/:id (PUT)', () => {
    it('should update a ride', () => {
      const updateData = {
        fareEstimate: 7.5,
      };

      return request(app.getHttpServer())
        .put('/rides/1')
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.fareEstimate).toBe(updateData.fareEstimate);
        });
    });
  });

  describe('/rides/:id/cancel (PUT)', () => {
    it('should cancel a ride', () => {
      return request(app.getHttpServer())
        .put('/rides/1/cancel')
        .expect(200);
    });
  });

  describe('/rides/:id/start (PUT)', () => {
    it('should start a ride session', () => {
      return request(app.getHttpServer())
        .put('/rides/1/start')
        .expect(200)
        .expect((res) => {
          expect(res.body.rideStatus).toBe('IN_PROGRESS');
        });
    });
  });

  describe('/rides/:id/complete (PUT)', () => {
    it('should complete a ride', () => {
      return request(app.getHttpServer())
        .put('/rides/1/complete')
        .expect(200)
        .expect((res) => {
          expect(res.body.rideStatus).toBe('COMPLETED');
          expect(res.body).toHaveProperty('dropoffTime');
        });
    });
  });

  describe('/rides/driver/:driverId (GET)', () => {
    it('should return rides by driver', () => {
      return request(app.getHttpServer())
        .get('/rides/driver/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/rides/search (GET)', () => {
    it('should search rides by pickup location', () => {
      return request(app.getHttpServer())
        .get('/rides/search?pickupLocation=AUBH')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
