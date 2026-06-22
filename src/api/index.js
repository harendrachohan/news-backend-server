const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const { typeDefs } = require('../graphql/schema');
const { resolvers } = require('../graphql/resolvers');

async function createApp() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({}),
    })
  );

  app.get('/', (_req, res) => {
    res.json({
      message: 'News Backend GraphQL API',
      graphql: '/graphql',
      examples: {
        health: '{ health { status timestamp } }',
        articles: '{ articles(limit: 5, category: "tech") { page data { title url summary } } }',
        search: '{ searchArticles(q: "cricket", limit: 5) { data { title url rank } } }',
        byState: '{ articlesByState(state: "uttarakhand", limit: 5) { data { title state } } }',
      },
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found. Use POST /graphql' });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
