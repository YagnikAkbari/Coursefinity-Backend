const redis = require("redis");

const redisClient = redis.createClient().on("error", (error) => {
  console.log("ERROR:- REDIS", error);
  throw error;
});

module.exports = { redisClient };
