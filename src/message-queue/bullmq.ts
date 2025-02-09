import { _env } from '@environment';
import { IRedisConnectionConfig } from '@interfaces';
import { logger } from '@utils';
import * as constants from '@utils/constants';

export const redisConnectionConfig: IRedisConnectionConfig = {
	host: String(_env.get('REDIS_HOST')),
	port: Number(_env.get('REDIS_PORT')),
};

if (_env.get('NODE_ENV') == constants.NODE_ENV.PRODUCTION) {
	redisConnectionConfig.password = String(_env.get('REDIS_USER_PASSWORD'));
}

// logger.info({ redisConnectionConfig });
