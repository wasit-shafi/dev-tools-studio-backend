import fs from 'fs';
import path from 'path';
import cors from 'cors';
import YAML from 'yaml';
import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { routerV1 } from './api/v1/router';
import { routerV2 } from './api/v2/router';

import type { Request, Response, NextFunction } from 'express';

import { ApiError } from '@utils';
import { _env } from '@environment';
import { globalErrorController } from '@controllers';

const app = express();

const corsOrigin = _env.get('CORS_ORIGIN');
if (corsOrigin && typeof corsOrigin === 'string') {
	// TODO(wasit): review cors options later (specially for prod env)
	const corsOptions = {
		origin: corsOrigin,
		credentials: true,
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	};
	app.use(cors(corsOptions));
}

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, 'config/swagger/openapi.yaml'), 'utf8'));

// TODO: review swaggerOptions later for more configuration

const swaggerOptions = {
	explorer: true,
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);

app.get('/', (request: Request, response: Response) => {
	response.json({ message: 'Hello World!!' }).send();
});

app.all('*', (request: Request, response: Response, next: NextFunction) => {
	next(new ApiError(`Can't find ${request.originalUrl} on the server`, 404));
});

app.use(globalErrorController);

export { app };
