const Queue = require('bull');
const cron = require('node-cron');
const config = require('../config');
const { SOURCES } = require('../config/sources');
const { fetchSource } = require('../fetchers/rssFetcher');
const { upsertSource, saveArticles } = require('../services/articleService');
const { getRedisClient } = require('../cache/redis');

const redisOpts = { host: config.redis.host, port: config.redis.port };

const fetchQueue = new Queue('news-fetch', { redis: redisOpts });
const aiQueue = new Queue('news-ai', { redis: redisOpts });

function scheduleFetchJobs() {
  cron.schedule(config.fetchCron, () => {
    console.log(`Scheduling fetch for ${SOURCES.length} sources`);
    SOURCES.forEach((source) => {
      fetchQueue.add({ source }, { attempts: 3, backoff: 5000 });
    });
  });
}

async function startWorkers() {
  const redisClient = await getRedisClient();

  for (const source of SOURCES) {
    await upsertSource(source);
  }

  fetchQueue.process(async (job) => {
    const { source } = job.data;
    console.log(`Fetching: ${source.name}`);
    const articles = await fetchSource(source);
    const inserted = await saveArticles(articles, redisClient);

    for (const article of inserted) {
      await aiQueue.add({ articleId: article.id, article }, { attempts: 2, backoff: 10000 });
    }

    console.log(`${source.name}: ${articles.length} fetched, ${inserted.length} new`);
    return { fetched: articles.length, inserted: inserted.length };
  });

  fetchQueue.on('failed', (job, err) => {
    console.error(`Fetch job failed (${job.data?.source?.name}):`, err.message);
  });

  scheduleFetchJobs();

  // Run once on startup
  SOURCES.forEach((source) => {
    fetchQueue.add({ source }, { attempts: 3, backoff: 5000 });
  });
}

module.exports = { fetchQueue, aiQueue, startWorkers, scheduleFetchJobs };
