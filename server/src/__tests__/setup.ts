// Global test setup - runs before all test files
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.PG_HOST = 'localhost';
process.env.PG_DATABASE = 'super_duper_forum_test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.COOKIE_NAME = 'test_session';
process.env.SESSION_SECRET = 'test_secret_key';

// Increase timeout for database operations
jest.setTimeout(10000);
