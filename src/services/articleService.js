const db = require('../db');
const { slugify } = require('../utils/slug');
const { isDuplicate } = require('../utils/dedup');

async function upsertSource(source) {
  await db.query(
    `INSERT INTO sources (name, rss_url, category, state)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (name) DO UPDATE SET
       rss_url = EXCLUDED.rss_url,
       category = EXCLUDED.category,
       state = EXCLUDED.state`,
    [source.name, source.url, source.category || null, source.state || null]
  );
}

async function saveArticles(articles, redisClient) {
  const inserted = [];

  for (const article of articles) {
    if (!article.url) continue;

    const duplicate = await isDuplicate(article.urlHash, redisClient);
    if (duplicate) continue;

    try {
      const result = await db.query(
        `INSERT INTO articles (
           source_id, title, slug, url, url_hash, content,summary,
           image_url, category, state, published_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (url_hash) DO NOTHING
         RETURNING id, title, content, category, state`,
        [
          article.sourceId,
          article.title,
          slugify(article.title),
          article.url,
          article.urlHash,
          article.content,
          article.summary,
          article.imageUrl,
          article.category,
          article.state,
          article.publishedAt,
        ]
      );

      if (result.rows[0]) {
        inserted.push(result.rows[0]);
      }
    } catch (err) {
      if (err.code !== '23505') {
        console.error('Failed to insert article:', err.message);
      }
    }
  }

  return inserted;
}

async function listArticles({ page = 1, limit = 20, category, state, q }) {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const offset = (safePage - 1) * safeLimit;

  let query = `
    SELECT id, source_id, title, slug, url, content, summary,
           image_url, category, state, lang, published_at, created_at
    FROM articles WHERE 1=1`;
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (state) {
    params.push(state);
    query += ` AND state = $${params.length}`;
  }
  if (q) {
    params.push(q);
    query += ` AND search_vec @@ plainto_tsquery('english', $${params.length})`;
  }

  params.push(safeLimit, offset);
  query += ` ORDER BY published_at DESC NULLS LAST LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const result = await db.query(query, params);
  return { data: result.rows, page: safePage, limit: safeLimit };
}

async function searchArticles({ q, page = 1, limit = 20 }) {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const offset = (safePage - 1) * safeLimit;

  const result = await db.query(
    `SELECT id, source_id, title, slug, url, summary, image_url,
            category, state, published_at,
            ts_rank(search_vec, plainto_tsquery('english', $1)) AS rank
     FROM articles
     WHERE search_vec @@ plainto_tsquery('english', $1)
     ORDER BY rank DESC, published_at DESC NULLS LAST
     LIMIT $2 OFFSET $3`,
    [q, safeLimit, offset]
  );

  return { data: result.rows, page: safePage, limit: safeLimit, query: q };
}

async function getArticlesByState(state, { page = 1, limit = 20 }) {
  return listArticles({ page, limit, state });
}

async function getArticleById(id) {
  const result = await db.query(
    `SELECT id, source_id, title, slug, url, content, summary,
            image_url, category, state, lang, published_at, created_at
     FROM articles WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function listSources() {
  const result = await db.query(
    `SELECT id, name, rss_url, category, state, active
     FROM sources ORDER BY name`
  );
  return result.rows;
}

async function updateArticleAiFields(id, { summary, category, state }) {
  await db.query(
    `UPDATE articles
     SET summary = COALESCE($2, summary),
         category = COALESCE($3, category),
         state = COALESCE($4, state)
     WHERE id = $1`,
    [id, summary, category, state]
  );
}

module.exports = {
  upsertSource,
  saveArticles,
  listArticles,
  searchArticles,
  getArticlesByState,
  getArticleById,
  listSources,
  updateArticleAiFields,
};
