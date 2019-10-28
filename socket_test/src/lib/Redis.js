const redis = require('redis');
const { promisify } = require('util');
const bluebird = require('bluebird');
const client = redis.createClient(process.env.REDIS_URL);
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = client