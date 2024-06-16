import { config } from './config/config';

import { connectDatabase } from './database';
import { app } from './app';

connectDatabase()
	.then(() => {
		const port = config.get('PORT');
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error('Something Went Wrong :', error);
		process.exit(1);
	});
