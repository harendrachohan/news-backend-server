const crypto = require('crypto');
const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'news-backend-server/1.0',
  },
});

async function fetchSource(source) {
  const feed = await parser.parseURL(source.url);

  return feed.items.map((item) => ({
    sourceId: source.name,
    title: item.title || 'Untitled',
    url: item.link,
    content: item.contentSnippet || item.content || item.summary || '',
    imageUrl: item.enclosure?.url || extractImageFromItem(item),
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    urlHash: crypto.createHash('sha256').update(item.link || item.guid || item.title).digest('hex'),
    category: source.category || null,
    state: source.state || null,
  }));
}

function extractImageFromItem(item) {
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;
  return null;
}

module.exports = { fetchSource };
