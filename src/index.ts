import { config } from './config/config';

import express from 'express';

const port = config.get('PORT');

const app = express();

app.get('/', (req, res) => {
	res.json({ message: `Server is running on port ${port}` }).send();
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
