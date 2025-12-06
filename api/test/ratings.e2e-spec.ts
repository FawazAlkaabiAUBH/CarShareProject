import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RatingController (e2e)', () => {
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

  describe('/ratings (POST)', () => {
    it('should create a new rating', () => {
      const newRating = {
        driverId: 1,
        riderId: 1,
        score: 5,
        comment: 'Excellent ride!',
      };

      return request(app.getHttpServer())
        .post('/ratings')
        .send(newRating)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('ratingId');
          expect(res.body.score).toBe(newRating.score);
          expect(res.body.comment).toBe(newRating.comment);
        });
    });

    it('should reject invalid score', () => {
      const invalidRating = {
        driverId: 1,
        riderId: 1,
        score: 6, // Invalid: must be 1-5
        comment: 'Test',
      };

      return request(app.getHttpServer())
        .post('/ratings')
        .send(invalidRating)
        .expect(500);
    });
  });

  describe('/ratings/:id (GET)', () => {
    it('should return a rating by id', async () => {
      const newRating = { driverId: 1, riderId: 1, score: 5, comment: 'Great!' };
      const createRes = await request(app.getHttpServer())
        .post('/ratings')
        .send(newRating);
      const ratingId = createRes.body.ratingId;

      return request(app.getHttpServer())
        .get(`/ratings/${ratingId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('ratingId');
          expect(res.body).toHaveProperty('score');
        });
    });
  });

  describe('/ratings/driver/:driverId (GET)', () => {
    it('should return ratings for a driver', () => {
      return request(app.getHttpServer())
        .get('/ratings/driver/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/ratings/driver/:driverId/average (GET)', () => {
    it('should return average rating for a driver', () => {
      return request(app.getHttpServer())
        .get('/ratings/driver/1/average')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('averageRating');
          expect(typeof res.body.averageRating).toBe('number');
        });
    });
  });

  describe('/ratings/rider/:riderId (GET)', () => {
    it('should return ratings by a rider', () => {
      return request(app.getHttpServer())
        .get('/ratings/rider/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
