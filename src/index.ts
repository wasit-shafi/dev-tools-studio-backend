import { app } from './app';
import { _env } from '@config';
import { connectDatabase } from './api/shared/database';

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
