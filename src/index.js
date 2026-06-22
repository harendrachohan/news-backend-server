const config = require('./config');
const { createApp } = require('./api');
const { startWorkers } = require('./queue/fetchQueue');
const { startAiWorker } = require('./queue/aiQueue');

async function main() {
  const app = await createApp();

  app.listen(config.port, () => {
    console.log(`News GraphQL API listening on http://localhost:${config.port}`);
    console.log(`  GraphQL endpoint: http://localhost:${config.port}/graphql`);
    console.log(`  Docs / examples:  http://localhost:${config.port}/`);
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
