const DEDUP_TTL_SECONDS = 172800; // 48 hours

async function isDuplicate(urlHash, redisClient) {
  const key = `article:${urlHash}`;
  const exists = await redisClient.get(key);
  if (exists) return true;
  await redisClient.setEx(key, DEDUP_TTL_SECONDS, '1');
  return false;
}

module.exports = { isDuplicate, DEDUP_TTL_SECONDS };
