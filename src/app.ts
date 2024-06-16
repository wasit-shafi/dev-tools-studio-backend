import express, { RequestHandler } from 'express';
import { mainRouter } from './routes/main-router';

const app = express();

const rootController: RequestHandler = (request, response) => {
	response.json({ message: `Hello World!!` }).send();
};

app.get('/', rootController);

// main router used only for all the v1 api's

app.use('/api/v1', mainRouter);

export { app };
