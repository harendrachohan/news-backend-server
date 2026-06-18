CREATE TABLE IF NOT EXISTS sources (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  rss_url    TEXT NOT NULL,
  category   TEXT,
  state      TEXT,
  active     BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id           SERIAL PRIMARY KEY,
  source_id    TEXT,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE,
  url          TEXT UNIQUE NOT NULL,
  url_hash     TEXT UNIQUE NOT NULL,
  content      TEXT,
  summary      TEXT,
  image_url    TEXT,
  category     TEXT,
  state        TEXT,
  lang         TEXT DEFAULT 'en',
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  search_vec   TSVECTOR
);

CREATE OR REPLACE FUNCTION articles_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vec :=
    setweight(to_tsvector('pg_catalog.english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('pg_catalog.english', coalesce(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS articles_search_update ON articles;
CREATE TRIGGER articles_search_update
  BEFORE INSERT OR UPDATE OF title, content ON articles
  FOR EACH ROW EXECUTE FUNCTION articles_search_update();

CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN(search_vec);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_state ON articles(state);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source_id);
