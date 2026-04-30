const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('ready', () => {
  console.log('Redis is ready');
});

module.exports = redisClient;
