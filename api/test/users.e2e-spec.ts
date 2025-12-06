import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
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

  describe('/users (GET)', () => {
    it('should return all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id', () => {
      return request(app.getHttpServer())
        .get('/users/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('userId', 1);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('email');
        });
    });

    it('should return 500 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/999')
        .expect(500);
    });
  });

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      const newUser = {
        name: 'Test User',
        email: 'test@aubh.edu',
        phoneNumber: '+973-1234-5678',
        role: 'RIDER',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('userId');
          expect(res.body.name).toBe(newUser.name);
          expect(res.body.email).toBe(newUser.email);
          expect(res.body.accountStatus).toBe('ACTIVE');
        });
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update a user', () => {
      const updateData = {
        name: 'Updated Name',
      };

      return request(app.getHttpServer())
        .put('/users/1')
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
        });
    });
  });

  describe('/users/:id/deactivate (POST)', () => {
    it('should deactivate a user account', () => {
      return request(app.getHttpServer())
        .post('/users/2/deactivate')
        .expect(200);
    });
  });

  describe('/users/login (POST)', () => {
    it('should authenticate with any password (hardcoded)', () => {
      const credentials = {
        email: 'alice@aubh.edu',
        password: 'anypassword',
      };

      return request(app.getHttpServer())
        .post('/users/login')
        .send(credentials)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('userId');
          expect(res.body.email).toBe(credentials.email);
        });
    });

    it('should fail for non-existent email', () => {
      const credentials = {
        email: 'nonexistent@aubh.edu',
        password: 'anypassword',
      };

      return request(app.getHttpServer())
        .post('/users/login')
        .send(credentials)
        .expect(500);
    });
  });
});
