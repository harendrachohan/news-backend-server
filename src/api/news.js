const express = require('express');
const config = require('../config');
const { cached } = require('../cache/redis');
const {
  listArticles,
  searchArticles,
  getArticlesByState,
} = require('../services/articleService');

const router = express.Router();

function cacheKey(prefix, query) {
  const sorted = Object.keys(query)
    .sort()
    .map((k) => `${k}=${query[k]}`)
    .join('&');
  return `${prefix}:${sorted}`;
}

router.get('/news', async (req, res, next) => {
  try {
    const { page, limit, category, state, q } = req.query;
    const key = cacheKey('news', { page, limit, category, state, q });

    const result = await cached(key, config.cacheTtl, () =>
      listArticles({ page, limit, category, state, q })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { q, page, limit } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const key = cacheKey('search', { q, page, limit });
    const result = await cached(key, config.cacheTtl, () =>
      searchArticles({ q: q.trim(), page, limit })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/state/:state', async (req, res, next) => {
  try {
    const { state } = req.params;
    const { page, limit } = req.query;
    const key = cacheKey('state', { state, page, limit });

    const result = await cached(key, config.cacheTtl, () =>
      getArticlesByState(state, { page, limit })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
