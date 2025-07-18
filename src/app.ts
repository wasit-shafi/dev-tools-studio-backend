import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

import { routerV1 } from '@apiV1/router';
import { routerV2 } from '@apiV2/router';
import { globalErrorController } from '@controllers';
import { _env } from '@environment';
import { globalApiRateLimiter, ipInfo } from '@middlewares';
import { ApiError, ApiResponse, asyncHandler, logger, MESSAGES } from '@utils';
import * as constants from '@utils/constants';

import { serverAdapter } from './bull-board/create-board';

import type { Request, Response, NextFunction } from 'express';

export const app = express();

app.use(helmet());

app.use(ipInfo);

app.use(
	cors({
		credentials: true,
		origin: String(_env.get('CORS_ORIGIN')),
		optionsSuccessStatus: constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
	})
);

app.use(globalApiRateLimiter);

app.set('view engine', 'ejs');

app.use(morgan(':method :url :status :date[iso]'));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

if (_env.get('NODE_ENV') === constants.NODE_ENV.DEVELOPMENT) {
	// bull board dashboard ui for bullmq queues

	app.use('/ui', serverAdapter.getRouter());

	// NOTE(WASIT): in production build openapi.yaml will not be there due to tsc so have to explicitly copy that, for more info refer below links
	// https://stackoverflow.com/questions/74322223/typescript-build-output-misses-some-files
	// https://www.darraghoriordan.com/2021/01/03/copying-missing-files-typescript-build-deploy

	const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, 'config/swagger/openapi.yaml'), 'utf8'));
	// TODO(WASIT): review swaggerOptions later for more configuration

	const swaggerOptions = {
		explorer: true,
	};

	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
}

app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);

app.get('/', (request: Request, response: Response) => {
	console.clear();
	console.log('request :: ', request);
	const getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key: string, value: unknown) => {
			if (typeof value === 'object' && value !== null) {
				if (seen.has(value)) {
					return '[Circular]';
				}
				seen.add(value);
			}
			return value;
		};
	};

	const safeStringify = (value: unknown, space?: string | number) => {
		const circularReplacer = getCircularReplacer();
		return JSON.stringify(
			value,
			(key, value) => {
				if (typeof value === 'bigint') {
					return value.toString();
				} else if (Buffer.isBuffer(value)) {
					return value.toString('base64');
				}

				return circularReplacer(key, value);
			},
			space
		);
	};

	response.json(
		new ApiResponse(MESSAGES.SHARED.SERVER_HEALTH_CHECK, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, {
			requestProtocol: request.protocol,
			requestIp: request.ip,
			ipInfo: request.ipInfo,
			headers: request.headers,
			reqData: {
				headers: request.headers,
				method: request.method,
				url: request.url,
				httpVersion: request.httpVersion,
				body: request.body,
				cookies: request.cookies,
				path: request.path,
				protocol: request.protocol,
				query: request.query,
				hostname: request.hostname,
				ip: request.ip,
				originalUrl: request.originalUrl,
				params: request.params,
			},
			req: safeStringify(request),
		})
	);
});

app.all('*', (request: Request, response: Response, next: NextFunction) => {
	next(new ApiError(`Can't find ${request.originalUrl} on the server`, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
});

app.use(globalErrorController);
