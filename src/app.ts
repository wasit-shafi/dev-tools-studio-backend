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
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { globalErrorController } from '@controllers';
import { _env } from '@environment';
import { ApiError, ApiResponse, asyncHandler, globalApiRateLimiter, logger } from '@utils';
import * as constants from '@utils/constants';

import { serverAdapter } from './bull-board/create-board';

import type { Request, Response, NextFunction } from 'express';

export const app = express();

app.use(helmet());

app.use(
	cors({
		credentials: true,
		origin: _env.get('CORS_ORIGIN') as string,
		optionsSuccessStatus: constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
	})
);

app.use(globalApiRateLimiter);

// app.set('view engine', 'ejs');

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
// TODO: temporarily used here just for confirmation

const s3Client = new S3Client({
	region: _env.get('AWS_S3_BUCKET_REGION') as string,
	credentials: {
		accessKeyId: _env.get('AWS_ACCESS_KEY_ID') as string,
		secretAccessKey: _env.get('AWS_SECRET_ACCESS_KEY') as string,
	},
});

app.post(
	'/upload',
	asyncHandler(async (request: Request, response: Response) => {
		const s3ClientResponse = await s3Client.send(
			new PutObjectCommand({
				Bucket: _env.get('AWS_S3_BUCKET_NAME') as string,
				Key: 'sample.txt',
				Body: 'sample text content',
			})
		);
		response.send({ ...s3ClientResponse });
		return;
	})
);
// bull board dashboard ui for bullmq queues

app.use('/ui', serverAdapter.getRouter());

app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);

app.get('/', (request: Request, response: Response) => {
	response.json(new ApiResponse({ healthCheck: 'Server on working fine', yourIp: request.ip, requestProtocol: request.protocol }));
	return;
});

app.all('*', (request: Request, response: Response, next: NextFunction) => {
	next(new ApiError(`Can't find ${request.originalUrl} on the server`, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
});

app.use(globalErrorController);
