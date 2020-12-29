import redis from 'redis';

const { REDIS_HOST, REDIS_PORT } = process.env;
const memoryStore = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });

export default memoryStore;
