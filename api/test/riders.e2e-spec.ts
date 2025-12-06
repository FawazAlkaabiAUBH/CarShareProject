import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RiderController (e2e)', () => {
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

  describe('/riders (POST)', () => {
    it('should create a new rider profile', () => {
      const newRider = {
        userId: 2,
      };

      return request(app.getHttpServer())
        .post('/riders')
        .send(newRider)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('riderId');
          expect(res.body.userId).toBe(newRider.userId);
          expect(res.body.loyaltyPoints).toBe(0);
        });
    });
  });

  describe('/riders (GET)', () => {
    it('should return all riders', () => {
      return request(app.getHttpServer())
        .get('/riders')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/riders/:id (GET)', () => {
    it('should return a rider by id', () => {
      return request(app.getHttpServer())
        .get('/riders/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('riderId', 1);
          expect(res.body).toHaveProperty('loyaltyPoints');
        });
    });
  });

  describe('/riders/:id/loyalty (PUT)', () => {
    it('should update loyalty points', () => {
      const loyaltyData = {
        points: 50,
      };

      return request(app.getHttpServer())
        .put('/riders/1/loyalty')
        .send(loyaltyData)
        .expect(200);
    });
  });

  describe('/riders/user/:userId (GET)', () => {
    it('should return rider profile by user id', () => {
      return request(app.getHttpServer())
        .get('/riders/user/2')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('riderId');
          expect(res.body.userId).toBe(2);
        });
    });
  });
});
