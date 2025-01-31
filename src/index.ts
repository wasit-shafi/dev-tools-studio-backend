import { connectDatabase } from '@database';
import { _env } from '@environment';

import { app } from './app';

connectDatabase()
	.then(() => {
		const port = _env.get('EXPRESS_PORT');
		app.listen({ port }, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error(error);

		process.exit(1); // terminating the process
	});
