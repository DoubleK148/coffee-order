import request from 'supertest';
import app from '../app';
import { connect, disconnect } from '../config';
import UserModel from '../models/User';

describe('Auth API', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register with invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
          fullName: '',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123',
          fullName: 'Login User',
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });
}); 