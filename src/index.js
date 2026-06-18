const config = require('./config');
const { createApp } = require('./api');
const { startWorkers } = require('./queue/fetchQueue');
const { startAiWorker } = require('./queue/aiQueue');

async function main() {
  const app = createApp();

  app.listen(config.port, () => {
    console.log(`News API listening on http://localhost:${config.port}`);
    console.log(`  GET /api/news?page=1&category=tech&state=delhi&q=election`);
    console.log(`  GET /api/search?q=cricket`);
    console.log(`  GET /api/state/maharashtra`);
    console.log(`  GET /api/health`);
  });

  try {
    startAiWorker();
    await startWorkers();
    console.log(`Fetch cron scheduled: ${config.fetchCron}`);
  } catch (err) {
    console.error('Failed to start queue workers:', err.message);
    console.error('Ensure PostgreSQL and Redis are running.');
  }
}

main();
