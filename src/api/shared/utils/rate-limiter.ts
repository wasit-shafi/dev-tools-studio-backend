import { rateLimit } from 'express-rate-limit';

import { _env } from '@environment';
import { ApiError, messages } from '@utils';
import * as constants from '@utils/constants';

import type { Request, Response, NextFunction } from 'express';

export const globalApiRateLimiter = rateLimit({
	windowMs: constants.TIME.MS.MINUTE * Number(_env.get('API_RATE_LIMITER_WINDOW_IN_MINUTE')),
	limit: Number(_env.get('API_RATE_LIMITER_THRESHOLD_LIMIT')),
	standardHeaders: 'draft-7',
	// Disable the `X-RateLimit-*` headers.
	legacyHeaders: false,
	skip: (request: Request, response: Response) => {
		// return String(_env.get('API_RATE_LIMITER_IP_WHITELIST')).split(',').includes(String(request.ip));
		return false;
	},
	handler: (request: Request, response: Response, next: NextFunction, options) => {
		// TODO(WASIT): create a new transport for logging request details like ip in separate db.
		// console.log('options :: ', options);
		next(
			new ApiError(
				`${messages.HTTP_STATUS.CLIENT.TOO_MANY_REQUEST} (You exceeded ${_env.get('API_RATE_LIMITER_THRESHOLD_LIMIT')} Api requests per ${_env.get('API_RATE_LIMITER_WINDOW_IN_MINUTE')} minutes)`,
				constants.HTTP_STATUS_CODES.CLIENT_ERROR.TOO_MANY_REQUESTS,
				{ clientIp: request.ip }
			)
		);
	},
});

export const apiRateLimiterStrict = rateLimit({
	windowMs: constants.TIME.MS.MINUTE * Number(_env.get('API_RATE_LIMITER_WINDOW_IN_MINUTE_STRICT')),
	limit: Number(_env.get('API_RATE_LIMITER_THRESHOLD_LIMIT_STRICT')),
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	skip: (request: Request, response: Response) => {
		// return String(_env.get('API_RATE_LIMITER_IP_WHITELIST')).split(',').includes(String(request.ip));
		return false;
	},
	handler: (request: Request, response: Response, next: NextFunction, options) => {
		next(
			new ApiError(
				`${messages.HTTP_STATUS.CLIENT.TOO_MANY_REQUEST} (You exceeded ${_env.get('API_RATE_LIMITER_THRESHOLD_LIMIT_STRICT')} Api requests per ${_env.get('API_RATE_LIMITER_WINDOW_IN_MINUTE_STRICT')} minutes)`,
				constants.HTTP_STATUS_CODES.CLIENT_ERROR.TOO_MANY_REQUESTS,
				{ clientIp: request.ip }
			)
		);
	},
});
