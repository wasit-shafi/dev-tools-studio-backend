import { Router } from 'express';
import { userRouter } from './routes';

import { _env } from '../../config/environments/env';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: `Hello World - V1(${_env.get('NODE_ENV')})` });
});

router.use('/user', userRouter);

export const routerV1 = router;
