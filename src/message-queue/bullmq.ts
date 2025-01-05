import { _env } from '@environment';
import * as constants from '@utils/constants';

interface IRedisConnectionConfig {
	host: string;
	port: number;
	password?: string;
}
export const redisConnectionConfig: IRedisConnectionConfig = {
	host: String(_env.get('REDIS_HOST')),
	port: Number(_env.get('REDIS_PORT')),
};

if (_env.get('NODE_ENV') == constants.NODE_ENV.PRODUCTION) {
	redisConnectionConfig.password = String(_env.get('REDIS_USER_PASSWORD'));
}

// console.log('redisConnectionConfig :: ', redisConnectionConfig);
