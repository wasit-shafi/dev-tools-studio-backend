import express, { Request, Response } from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';

const app = express();

// //
// app.use(
// 	cors({
// 		origin: process.env.CORS_ORIGIN,
// 		credentials: true,
// 	})
// );
//
app.use(express.static('public'));

app.use(express.json({ limit: '16kb' }));
//

app.use(express.urlencoded({ extended: true, limit: '16kb' }));
//
app.use(cookieParser());

app.get('/', (request: Request, response: Response) => {
	response.json({ message: `Hello World!!` }).send();
});

import { routerV1 } from './api/v1/router';
import { routerV2 } from './api/v2/router';

app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);

export { app };
