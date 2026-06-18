const { createClient } = require('redis');
const config = require('../config');

let client = null;

async function getRedisClient() {
  if (client?.isOpen) return client;

  client = createClient({
    socket: { host: config.redis.host, port: config.redis.port },
  });

  client.on('error', (err) => {
    console.error('Redis error:', err.message);
  });

  await client.connect();
  return client;
}

async function cached(key, ttlSeconds, fetchFn) {
  const redis = await getRedisClient();

  const cachedValue = await redis.get(key);
  if (cachedValue) {
    return JSON.parse(cachedValue);
  }

  const value = await fetchFn();
  await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  return value;
}

module.exports = { getRedisClient, cached };
