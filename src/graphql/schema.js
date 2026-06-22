const typeDefs = `#graphql
  type Article {
    id: ID!
    sourceId: String
    title: String!
    slug: String
    url: String!
    content: String
    summary: String
    imageUrl: String
    category: String
    state: String
    lang: String
    publishedAt: String
    createdAt: String
    rank: Float
  }

  type ArticleConnection {
    data: [Article!]!
    page: Int!
    limit: Int!
    query: String
  }

  type Source {
    id: ID!
    name: String!
    rssUrl: String!
    category: String
    state: String
    active: Boolean
  }

  type Health {
    status: String!
    timestamp: String!
  }

  type Query {
    """Server health check"""
    health: Health!

    """List articles with optional filters (category, state, full-text q)"""
    articles(
      page: Int = 1
      limit: Int = 20
      category: String
      state: String
      q: String
    ): ArticleConnection!

    """Full-text search across title and content"""
    searchArticles(q: String!, page: Int = 1, limit: Int = 20): ArticleConnection!

    """Articles filtered by Indian state slug (e.g. uttarakhand, delhi)"""
    articlesByState(state: String!, page: Int = 1, limit: Int = 20): ArticleConnection!

    """Fetch a single article by ID"""
    article(id: ID!): Article

    """All configured RSS sources"""
    sources: [Source!]!
  }
`;

module.exports = { typeDefs };
