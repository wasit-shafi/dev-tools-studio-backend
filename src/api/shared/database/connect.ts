import mongoose from 'mongoose';

import { env } from '../../../config/environments/env';
import * as constants from '../../shared/utils/constants';

export const connectDatabase = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${env.get('DATABASE_URI')}/${constants.DATABASE_NAME}
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
