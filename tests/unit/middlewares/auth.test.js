const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { auth, authorize } = require('../../../src/middlewares/auth');
const { UnauthorizedError, ForbiddenError } = require('../../../src/core/ApiError');
const config = require('../../../src/config/config');

// Mock the dependencies
jest.mock('jsonwebtoken');

describe('Auth middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('auth middleware', () => {
    test('should call next with UnauthorizedError if authorization header is missing', async () => {
      req.headers.authorization = null;

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    test('should call next with UnauthorizedError if authorization header format is invalid', async () => {
      req.headers.authorization = 'invalid-format';

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    test('should call next with UnauthorizedError if token is invalid', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await auth(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.jwt.secret);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    test('should call next with UnauthorizedError if token is expired', async () => {
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe('Token expired');
    });

    test('should call next without error if token is valid', async () => {
      const decodedToken = { sub: 'user-123', role: 'admin' };
      jwt.verify.mockReturnValue(decodedToken);

      await auth(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.jwt.secret);
      expect(req.user).toEqual(decodedToken);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('authorize middleware', () => {
    test('should call next with UnauthorizedError if user is not authenticated', () => {
      const requiredRoles = ['admin'];
      const authorizeFn = authorize(...requiredRoles);

      authorizeFn(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    test('should call next with ForbiddenError if user does not have required role', () => {
      const requiredRoles = ['admin'];
      const authorizeFn = authorize(...requiredRoles);
      
      req.user = { role: 'user' };

      authorizeFn(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    test('should call next without error if user has required role', () => {
      const requiredRoles = ['admin', 'user'];
      const authorizeFn = authorize(...requiredRoles);
      
      req.user = { role: 'admin' };

      authorizeFn(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
}); 