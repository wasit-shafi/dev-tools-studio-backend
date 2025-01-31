import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import ipinfo, { defaultIPSelector } from 'ipinfo-express';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

import { routerV1 } from '@apiV1/router';
import { routerV2 } from '@apiV2/router';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { globalErrorController } from '@controllers';
import { _env } from '@environment';
import { ApiError, ApiResponse, asyncHandler, globalApiRateLimiter, MESSAGES } from '@utils';
import * as constants from '@utils/constants';

import { serverAdapter } from './bull-board/create-board';

import type { Request, Response, NextFunction } from 'express';

export const app = express();

app.use(helmet());

app.use(
	cors({
		credentials: true,
		origin: String(_env.get('CORS_ORIGIN')),
		optionsSuccessStatus: constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
	})
);

app.use(globalApiRateLimiter);

// For more info refer docs: https://github.com/ipinfo/node-express?tab=readme-ov-file#-ipinfo-nodejs-express-client-library

app.use(
	ipinfo({
		token: String(_env.get('IP_INFO_ACCESS_TOKEN')),
		cache: null,
		timeout: constants.IP_INFO_REQUESTS_TIMEOUT,
		ipSelector: _env.get('NODE_ENV') === constants.NODE_ENV.PRODUCTION ? defaultIPSelector : constants.mockIpSelector,
	})
);
// app.set('view engine', 'ejs');

app.use(morgan(':method :url :status :date[iso]'));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// NOTE(WASIT): in production build openapi.yaml will not be there due to tsc so have to explicitly copy that, for more info refer below links
// https://stackoverflow.com/questions/74322223/typescript-build-output-misses-some-files
// https://www.darraghoriordan.com/2021/01/03/copying-missing-files-typescript-build-deploy
const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, 'config/swagger/openapi.yaml'), 'utf8'));

// TODO(WASIT): review swaggerOptions later for more configuration

const swaggerOptions = {
	explorer: true,
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

const s3Client = new S3Client({
	region: String(_env.get('AWS_S3_BUCKET_REGION')),
	credentials: {
		accessKeyId: String(_env.get('AWS_ACCESS_KEY_ID')),
		secretAccessKey: String(_env.get('AWS_SECRET_ACCESS_KEY')),
	},
});

app.post(
	'/upload',
	asyncHandler(async (request: Request, response: Response) => {
		const s3ClientResponse = await s3Client.send(
			new PutObjectCommand({
				Bucket: String(_env.get('AWS_S3_BUCKET_NAME')),
				Key: 'sample.txt',
				Body: 'sample text content',
			})
		);
		response.send({ ...s3ClientResponse });
	})
);
// bull board dashboard ui for bullmq queues

app.use('/ui', serverAdapter.getRouter());

app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);

app.get('/', (request: Request, response: Response) => {
	response.json(
		new ApiResponse('', constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, {
			healthCheck: MESSAGES.SHARED.SERVER_HEALTH_CHECK,
			yourIp: request.ip,
			requestProtocol: request.protocol,
		})
	);
});

app.all('*', (request: Request, response: Response, next: NextFunction) => {
	next(new ApiError(`Can't find ${request.originalUrl} on the server`, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
});

app.use(globalErrorController);
