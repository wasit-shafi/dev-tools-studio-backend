import mongoose from 'mongoose';

import { _env } from '@environment';
import { logger, MESSAGES } from '@utils';
import * as constants from '@utils/constants';

export const connectDatabase = async () => {
	logger.info({
		port: _env.get('EXPRESS_PORT'),
		cors: _env.get('CORS_ORIGIN'),
		nodeEnv: _env.get('NODE_ENV'),
		dbUri: _env.get('DATABASE_URI'),
	});

	try {
		mongoose.connection.on('connected', () => {
			logger.info('DB CONNECTION EVENT: connected');
		});
		mongoose.connection.on('open', () => {
			logger.info('DB CONNECTION EVENT: open');
		});
		mongoose.connection.on('disconnected', () => {
			logger.info('DB CONNECTION EVENT: disconnected');
		});
		mongoose.connection.on('reconnected', () => {
			logger.info('DB CONNECTION EVENT: reconnected');
		});
		mongoose.connection.on('disconnecting', () => {
			logger.info('DB CONNECTION EVENT: disconnecting');
		});
		mongoose.connection.on('close', () => {
			logger.info('DB CONNECTION EVENT: close');
		});

		const connectionString = `${_env.get('DATABASE_URI')}/${constants.DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
		const connectionInstance = await mongoose.connect(connectionString);

		// logger.info({ connectionString, connectionInstance });
	} catch (error: unknown) {
		let errorMessage: string = MESSAGES.SHARED.DATABASE_CONNECTION_ERROR;

		if (error && error instanceof Object && 'message' in error && typeof error.message === 'string') {
			errorMessage = error.message;
		}

		throw new Error(errorMessage);
	}
};
