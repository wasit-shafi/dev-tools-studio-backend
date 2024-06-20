import express, { Request, Response } from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import { _env } from './config/environments/env';

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

app.use(cookieParser());

app.use(express.static('public'));

app.use(express.json({ limit: '16kb' }));
//

app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.get('/', (request: Request, response: Response) => {
	response.json({ message: `Hello World!!` }).send();
});

import { routerV1 } from './api/v1/router';
import { routerV2 } from './api/v2/router';

app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);

export { app };
