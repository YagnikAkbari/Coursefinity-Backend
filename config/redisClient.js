const redis = require("redis");

const redisClient = redis
  .createClient({
    url: process.env.REDIS_URL,
  })
  .on("error", (error) => {
    console.log("ERROR:- REDIS", error);
    throw error;
  });

module.exports = { redisClient };
