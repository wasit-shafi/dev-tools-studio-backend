import { _env } from '@environment';

export const redisConnectionConfig: any = {
	host: String(_env.get('REDIS_HOST')),
	port: Number(_env.get('REDIS_PORT')),
};

if (_env.get('NODE_ENV') == 'production') {
	redisConnectionConfig.password = _env.get('REDIS_USER_PASSWORD');
}

// console.log('redisConnectionConfig :: ', redisConnectionConfig);
