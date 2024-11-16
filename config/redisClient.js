const { Redis } = require("@upstash/redis");

let redis;
const redisClient = () => {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
};

module.exports = { redisClient };
