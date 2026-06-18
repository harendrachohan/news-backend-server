const KEYWORD_CATEGORIES = {
  tech: ['technology', 'software', 'ai', 'startup', 'iphone', 'google', 'microsoft', 'crypto', 'app'],
  sports: ['cricket', 'football', 'ipl', 'match', 'tournament', 'olympics', 'tennis', 'hockey', 'sport'],
  politics: ['election', 'parliament', 'minister', 'government', 'bjp', 'congress', 'policy', 'vote', 'modi'],
  business: ['market', 'stock', 'economy', 'rupee', 'gdp', 'investment', 'bank', 'trade', 'corporate'],
  entertainment: ['bollywood', 'movie', 'film', 'actor', 'music', 'celebrity', 'ott', 'series'],
  health: ['health', 'covid', 'hospital', 'doctor', 'vaccine', 'disease', 'medical'],
};

async function classify(title, content) {
  const text = `${title} ${content}`.toLowerCase();

  for (const [category, keywords] of Object.entries(KEYWORD_CATEGORIES)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }

  return 'general';
}

module.exports = { classify, KEYWORD_CATEGORIES };
