const config = require('../config');
const { cached } = require('../cache/redis');
const {
  listArticles,
  searchArticles,
  getArticlesByState,
  getArticleById,
  listSources,
} = require('../services/articleService');
const { mapArticle, mapConnection, mapSource } = require('./mappers');

function cacheKey(prefix, args) {
  const sorted = Object.keys(args)
    .sort()
    .map((k) => `${k}=${args[k] ?? ''}`)
    .join('&');
  return `gql:${prefix}:${sorted}`;
}

const resolvers = {
  Query: {
    health: () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),

    articles: async (_parent, args) => {
      const { page, limit, category, state, q } = args;
      const key = cacheKey('articles', { page, limit, category, state, q });

      const result = await cached(key, config.cacheTtl, () =>
        listArticles({ page, limit, category, state, q })
      );

      return mapConnection(result);
    },

    searchArticles: async (_parent, { q, page, limit }) => {
      const key = cacheKey('search', { q, page, limit });

      const result = await cached(key, config.cacheTtl, () =>
        searchArticles({ q: q.trim(), page, limit })
      );

      return mapConnection(result);
    },

    articlesByState: async (_parent, { state, page, limit }) => {
      const key = cacheKey('state', { state, page, limit });

      const result = await cached(key, config.cacheTtl, () =>
        getArticlesByState(state, { page, limit })
      );

      return mapConnection(result);
    },

    article: async (_parent, { id }) => {
      const row = await getArticleById(id);
      return mapArticle(row);
    },

    sources: async () => {
      const rows = await listSources();
      return rows.map(mapSource);
    },
  },
};

module.exports = { resolvers };
