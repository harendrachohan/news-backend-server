const SOURCES = [
  // International
  { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/rss.xml', category: 'world' },
  { name: 'Reuters', url: 'https://feeds.reuters.com/reuters/topNews', category: 'world' },

  // India - National
  { name: 'The Hindu', url: 'https://www.thehindu.com/feeder/default.rss', category: 'national' },
  { name: 'TOI', url: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms', category: 'national' },
  { name: 'NDTV', url: 'https://feeds.feedburner.com/ndtvnews-top-stories', category: 'national' },
  { name: 'India Today', url: 'https://www.indiatoday.in/rss/home', category: 'national' },

  // India - State-wise
  { name: 'TOI Mumbai', url: 'https://timesofindia.indiatimes.com/rssfeeds/3908702.cms', category: 'regional', state: 'maharashtra' },
  { name: 'TOI Delhi', url: 'https://timesofindia.indiatimes.com/rssfeeds/3908693.cms', category: 'regional', state: 'delhi' },
  { name: 'TOI Bangalore', url: 'https://timesofindia.indiatimes.com/rssfeeds/3908697.cms', category: 'regional', state: 'karnataka' },
  { name: 'TOI Chennai', url: 'https://timesofindia.indiatimes.com/rssfeeds/3908700.cms', category: 'regional', state: 'tamil-nadu' },

  // Google News (topic-based)
  { name: 'Google-India', url: 'https://news.google.com/rss/search?q=india&hl=en-IN&gl=IN', category: 'national' },
  { name: 'Google-Tech', url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pKVGlnQVAB', category: 'tech' },
  { name: 'Google-Sports', url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGQ2ZDNRd1NBbVZ1R2dKSlRpZ0FQAQ', category: 'sports' },
];

module.exports = { SOURCES };
