import mongoose from 'mongoose';

import { _env } from '../../../config/environments/env';
import * as constants from '../../shared/utils/constants';

export const connectDatabase = async () => {
	console.log({
		port: _env.get('PORT'),
		cors: _env.get('CORS_ORIGIN'),
		nodeEnv: _env.get('NODE_ENV'),
		dbUri: _env.get('DATABASE_URI'),
	});

	try {
		mongoose.connection.on('connected', () => {
			console.log('connected');
		});
		mongoose.connection.on('open', () => {
			console.log('open');
		});
		mongoose.connection.on('disconnected', () => {
			console.log('disconnected');
		});
		mongoose.connection.on('reconnected', () => {
			console.log('reconnected');
		});
		mongoose.connection.on('disconnecting', () => {
			console.log('disconnecting');
		});
		mongoose.connection.on('close', () => {
			console.log('close');
		});

		const connectionString = `${_env.get('DATABASE_URI')}/${
			constants.DATABASE_NAME
		}?retryWrites=true&w=majority&appName=Cluster0`;

		// console.log('connectionString', connectionString);

		const connectionInstance = await mongoose.connect(connectionString);
		// console.log(
		// 	'Successfully connected with database, connectionInstance: ' +
		// 		connectionInstance
		// );
	} catch (error: any) {
		throw new Error(error);
	}
};
