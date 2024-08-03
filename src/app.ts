import fs from 'fs';
import path from 'path';
import cors from 'cors';
import YAML from 'yaml';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';

import type { Request, Response, NextFunction } from 'express';

import { routerV1 } from '@apiV1/router';
import { routerV2 } from '@apiV2/router';

import { _env } from '@environment';
import * as constants from '@utils/constants';
import { globalErrorController } from '@controllers';
import { ApiError, ApiResponse, logger } from '@utils';

const app = express();

const corsOrigin = _env.get('CORS_ORIGIN');
if (corsOrigin && typeof corsOrigin === 'string') {
	// TODO(wasit): review cors options later (specially for prod env)

	const corsOptions = {
		origin: corsOrigin,
		credentials: true,
		optionsSuccessStatus: constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
	};
	app.use(cors(corsOptions));
}

app.use(morgan('dev'));

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

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
	response.json(new ApiResponse({ healthCheck: 'Server on working fine' }));
});

app.all('*', (request: Request, response: Response, next: NextFunction) => {
	next(new ApiError(`Can't find ${request.originalUrl} on the server`, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
});

app.use(globalErrorController);

export { app };
