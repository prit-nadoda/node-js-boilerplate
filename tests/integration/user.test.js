const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/modules/user/model/user.model');
const tokenService = require('../../src/modules/auth/service/token.service');

let mongoServer;

describe('User API', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let normalUser;

  beforeAll(async () => {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear users collection
    await User.deleteMany({});

    // Create test users
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    normalUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    // Generate tokens
    adminToken = tokenService.generateAccessToken(adminUser);
    userToken = tokenService.generateAccessToken(normalUser);
  });

  describe('GET /api/v1/users', () => {
    test('should return 401 if no token is provided', async () => {
      await request(app)
        .get('/api/v1/users')
        .expect(401);
    });

    test('should return 403 if non-admin user tries to access', async () => {
      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    test('should return list of users if admin token provided', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('results');
      expect(Array.isArray(res.body.data.results)).toBe(true);
      expect(res.body.data.results.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    test('should return 401 if no token is provided', async () => {
      await request(app)
        .get(`/api/v1/users/${normalUser._id}`)
        .expect(401);
    });

    test('should return user data if valid token provided', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${normalUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('_id', normalUser._id.toString());
      expect(res.body.data).toHaveProperty('name', normalUser.name);
      expect(res.body.data).toHaveProperty('email', normalUser.email);
      expect(res.body.data).not.toHaveProperty('password');
    });
  });

  describe('POST /api/v1/users', () => {
    test('should return 401 if no token is provided', async () => {
      await request(app)
        .post('/api/v1/users')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        })
        .expect(401);
    });

    test('should return 403 if non-admin user tries to create user', async () => {
      await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        })
        .expect(403);
    });

    test('should create user if admin token provided', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('name', userData.name);
      expect(res.body.data).toHaveProperty('email', userData.email);
      expect(res.body.data).not.toHaveProperty('password');
    });
  });
}); 