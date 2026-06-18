require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://news:news@localhost:5432/news',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  groqApiKey: process.env.GROQ_API_KEY || '',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  fetchCron: process.env.FETCH_CRON || '*/15 * * * *',
  cacheTtl: parseInt(process.env.CACHE_TTL, 10) || 300,
};
