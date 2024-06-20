import { _env } from './config/environments/env';

import { connectDatabase } from './api/shared/database';
import { app } from './app';

connectDatabase()
	.then(() => {
		const port = _env.get('PORT');
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error('Something Went Wrong :', error);
		process.exit(1);
	});
