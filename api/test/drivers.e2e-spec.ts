import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('DriverController (e2e)', () => {
  let app: INestApplication;

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

  describe('/drivers (POST)', () => {
    it('should create a new driver profile', () => {
      const newDriver = {
        userId: 3,
        licenseNumber: 'LIC-789012',
        vehicleModel: 'Honda Civic',
        vehiclePlateNumber: 'ABC-123',
        vehicleColor: 'Blue',
      };

      return request(app.getHttpServer())
        .post('/drivers')
        .send(newDriver)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('driverId');
          expect(res.body.licenseNumber).toBe(newDriver.licenseNumber);
          expect(res.body.vehicleModel).toBe(newDriver.vehicleModel);
          expect(res.body.averageRating).toBe(0);
        });
    });
  });

  describe('/drivers (GET)', () => {
    it('should return all drivers', () => {
      return request(app.getHttpServer())
        .get('/drivers')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/drivers/:id (GET)', () => {
    it('should return a driver by id', () => {
      return request(app.getHttpServer())
        .get('/drivers/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('driverId', 1);
          expect(res.body).toHaveProperty('licenseNumber');
          expect(res.body).toHaveProperty('vehicleInfo');
        });
    });
  });

  describe('/drivers/:id (PUT)', () => {
    it('should update driver details', () => {
      const updateData = {
        vehicleModel: 'Toyota Camry 2024',
      };

      return request(app.getHttpServer())
        .put('/drivers/1')
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.vehicleModel).toBe(updateData.vehicleModel);
        });
    });
  });

  describe('/drivers/:id/rating (PUT)', () => {
    it('should update driver rating', () => {
      const ratingData = {
        rating: 4.5,
      };

      return request(app.getHttpServer())
        .put('/drivers/1/rating')
        .send(ratingData)
        .expect(200);
    });
  });

  describe('/drivers/user/:userId (GET)', () => {
    it('should return driver profile by user id', () => {
      return request(app.getHttpServer())
        .get('/drivers/user/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('driverId');
          expect(res.body.userId).toBe(1);
        });
    });
  });
});
