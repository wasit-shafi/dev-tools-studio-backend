import { Router } from 'express';

import { _env } from '../../config';
import { mailRouter, userRouter } from './routes';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: `Hello World - V1(${_env.get('NODE_ENV')})` });
});

router.use('/user', userRouter);

router.use('/mail', mailRouter);

export const routerV1 = router;
