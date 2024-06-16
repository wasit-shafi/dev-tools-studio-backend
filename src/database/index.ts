import mongoose from 'mongoose';

import { config } from '../config/config';
import * as constants from '../utils/constants';

export const connectDatabase = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${config.get('DATABASE_URI')}/${constants.DATABASE_NAME}
			?retryWrites=true&w=majority&appName=Cluster0`
		);
		// console.log(
		// 	'Successfully connected with database, connectionInstance: ' +
		// 		connectionInstance
		// );
	} catch (error: any) {
		throw new Error(error);
	}
};
