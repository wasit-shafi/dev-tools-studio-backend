import fs from 'fs';
import path from 'path';
import cors from 'cors';
import YAML from 'yaml';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import swaggerUi from 'swagger-ui-express';
import { rateLimit } from 'express-rate-limit';

import type { Request, Response, NextFunction } from 'express';

import { routerV1 } from '@apiV1/router';
import { routerV2 } from '@apiV2/router';

import { _env } from '@environment';
import * as constants from '@utils/constants';
import { globalErrorController } from '@controllers';
import { ApiError, ApiResponse, logger } from '@utils';

const app = express();

app.use(helmet());

app.use(
	cors({
		credentials: true,
		origin: _env.get('CORS_ORIGIN') as string,
		optionsSuccessStatus: constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
	})
);

const defaultApiRateLimiter = rateLimit({
	windowMs: constants.TIME.MS.MINUTE * Number(_env.get('API_RATE_LIMITER_WINDOW_IN_MINUTE')),
	limit: Number(_env.get('API_RATE_LIMITER_THRESHOLD_LIMIT')),
	standardHeaders: 'draft-7',
	// Disable the `X-RateLimit-*` headers.
	legacyHeaders: false,
	skip: (request: Request, response: Response) => {
		// NOTE(wasit): used for testing purposes only in development env.
		// return false;
		return String(_env.get('API_RATE_LIMITER_IP_WHITELIST')).split(',').includes(String(request.ip));
	},
	handler: (request: Request, response: Response, next: NextFunction, options) => {
		// console.log('options :: ', options);
		next(
			new ApiError(
				`Too many requests, please try again later. (You exceeded ${_env.get('API_RATE_LIMITER_THRESHOLD_LIMIT')} Api requests per ${_env.get('API_RATE_LIMITER_WINDOW_IN_MINUTE')} minutes)`,
				constants.HTTP_STATUS_CODES.CLIENT_ERROR.TOO_MANY_REQUESTS,
				{ clientIp: request.ip }
			)
		);
	},
});

app.use(defaultApiRateLimiter);

app.use(morgan('dev'));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// NOTE(wasit): in production build openapi.yaml will not be there due to tsc so have to explicitly copy that, for more info refer below links
// https://stackoverflow.com/questions/74322223/typescript-build-output-misses-some-files
// https://www.darraghoriordan.com/2021/01/03/copying-missing-files-typescript-build-deploy
const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, 'config/swagger/openapi.yaml'), 'utf8'));

// TODO: review swaggerOptions later for more configuration

const swaggerOptions = {
	explorer: true,
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);

app.get('/', (request: Request, response: Response) => {
	response.json(new ApiResponse({ healthCheck: 'Server on working fine', yourIp: request.ip, requestProtocol: request.protocol }));
});

app.all('*', (request: Request, response: Response, next: NextFunction) => {
	next(new ApiError(`Can't find ${request.originalUrl} on the server`, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
});

app.use(globalErrorController);

export { app };
