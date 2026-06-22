# News Backend Server

Free-tier news aggregation backend: RSS ingestion, PostgreSQL full-text search, Bull job queues, Redis caching, Groq AI summarization, and a **GraphQL API**.

## Stack

| Layer | Tech | Cost |
|-------|------|------|
| API | GraphQL (Apollo Server) | Free |
| Runtime | Node.js + Express | Free |
| Queue | Bull + Redis | Free (self-hosted) |
| Database | PostgreSQL + FTS | Free (self-hosted) |
| Cache | Redis (5 min TTL) | Free (self-hosted) |
| AI | Groq API (optional) | Free tier (6k req/day) |
| RSS | rss-parser | Free |

## Quick Start

### 1. Start PostgreSQL and Redis

```bash
docker compose up -d
```

### 2. Install and configure

```bash
npm install
cp .env.example .env
# Add GROQ_API_KEY to .env for AI summaries (optional)
```

### 3. Run migrations

```bash
npm run migrate
```

### 4. Start the server

```bash
npm run dev
```

The server fetches all RSS sources immediately on startup, then every 15 minutes. New articles are queued for AI summarization and classification.

## GraphQL API

**Endpoint:** `POST http://localhost:3000/graphql`

Open `http://localhost:3000/` for example queries. Use [Apollo Sandbox](https://studio.apollographql.com/sandbox) or any GraphQL client pointed at `/graphql`.

### Schema overview

```
Query
├── health                          → Health!
├── articles(page, limit, category, state, q) → ArticleConnection!
├── searchArticles(q, page, limit)  → ArticleConnection!
├── articlesByState(state, page, limit) → ArticleConnection!
├── article(id)                     → Article
└── sources                         → [Source!]!
```

### Example queries

**Health check**
```graphql
query {
  health {
    status
    timestamp
  }
}
```

**Latest tech articles**
```graphql
query {
  articles(limit: 5, category: "tech") {
    page
    limit
    data {
      title
      url
      summary
      publishedAt
    }
  }
}
```

**Search**
```graphql
query {
  searchArticles(q: "cricket", limit: 5) {
    data {
      title
      url
      rank
    }
  }
}
```

**Uttarakhand news**
```graphql
query {
  articlesByState(state: "uttarakhand", limit: 10) {
    data {
      title
      state
      sourceId
      summary
    }
  }
}
```

**Single article + RSS sources**
```graphql
query {
  article(id: "1") {
    title
    content
    summary
  }
  sources {
    name
    rssUrl
    state
  }
}
```

### curl example

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health { status timestamp } }"}'
```

## Project Structure

```
src/
├── ai/              # Groq summarizer, keyword classifier, state detector
├── api/             # Express + Apollo Server setup
├── cache/           # Redis client + response caching
├── config/          # Env config + RSS source list
├── db/              # PostgreSQL pool
├── fetchers/        # RSS parser
├── graphql/         # Schema, resolvers, mappers
├── queue/           # Bull fetch + AI workers
├── services/        # Article persistence and queries
└── utils/           # Dedup, slug helpers
migrations/          # PostgreSQL schema + FTS triggers
scripts/migrate.js   # Run migrations
```

## RSS Sources

Configured in `src/config/sources.js`:

- **International:** BBC, Reuters
- **India national:** The Hindu, TOI, NDTV, India Today
- **State-wise:** TOI Mumbai, Delhi, Bangalore, Chennai, Dehradun + Amar Ujala/Jagran Uttarakhand
- **Google News:** India, Tech, Sports

## AI Layer

1. **Summarization** — Groq `llama3-8b-8192` (falls back to truncated content without API key)
2. **Category** — Keyword matching (tech, sports, politics, business, etc.)
3. **State detection** — Keyword matching for Indian states

## Environment Variables

See `.env.example`. Key variables:

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_HOST` / `REDIS_PORT` — Redis for Bull + cache
- `GROQ_API_KEY` — Optional, enables AI summaries
- `FETCH_CRON` — Cron schedule (default: `*/15 * * * *`)
- `CACHE_TTL` — API cache seconds (default: 300)

## Deployment (Free Tiers)

- **Oracle Cloud Always Free** — Best for self-hosting Postgres + Redis + Node on one VPS
- **Railway / Render / Fly.io** — Managed deploy with free credits
- **Supabase** — Free managed Postgres (500MB)

## Free Service Limits

| Service | Free Limit |
|---------|------------|
| Groq API | 6,000 req/day |
| Gemini Flash | 1,500 req/day |
| Hugging Face | Unlimited (slower) |
| Oracle Cloud VPS | Forever free |
