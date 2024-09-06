import { _env } from '@environment';

const redisConnectionConfig = {
	host: String(_env.get('REDIS_HOST')),
	port: Number(_env.get('REDIS_PORT')),
};

export { redisConnectionConfig };
