function mapArticle(row) {
  if (!row) return null;

  return {
    id: String(row.id),
    sourceId: row.source_id,
    title: row.title,
    slug: row.slug,
    url: row.url,
    content: row.content,
    summary: row.summary,
    imageUrl: row.image_url,
    category: row.category,
    state: row.state,
    lang: row.lang,
    publishedAt: row.published_at?.toISOString?.() || row.published_at,
    createdAt: row.created_at?.toISOString?.() || row.created_at,
    rank: row.rank != null ? Number(row.rank) : null,
  };
}

function mapConnection(result) {
  return {
    data: result.data.map(mapArticle),
    page: result.page,
    limit: result.limit,
    query: result.query || null,
  };
}

function mapSource(row) {
  return {
    id: String(row.id),
    name: row.name,
    rssUrl: row.rss_url,
    category: row.category,
    state: row.state,
    active: row.active,
  };
}

module.exports = { mapArticle, mapConnection, mapSource };
