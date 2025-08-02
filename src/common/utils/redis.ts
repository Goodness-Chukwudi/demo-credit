import { createClient } from 'redis';
import Env from '../environment_variables';

const redisClient = createClient({
    password: Env.REDIS_PASSWORD,
    socket: {
        host: Env.REDIS_HOST,
        port: Env.REDIS_PORT
    }
});

redisClient.on('error', error => console.log('Error connecting to redis client', error));
redisClient.on('ready', () => console.log('Redis connection is ready'));
redisClient.connect();

export default redisClient;