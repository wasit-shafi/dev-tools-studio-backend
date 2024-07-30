import { Router } from 'express';

import { _env } from '@environment';
import { mailRouter, userRouter, authRouter } from './routes';

import * as constants from '@utils/constants';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: `Hello World - V1(${_env.get('NODE_ENV')})` });
});

router.use(constants.ROUTES.USER, userRouter);

router.use(constants.ROUTES.MAIL, mailRouter);

router.use(constants.ROUTES.AUTH, authRouter);

export const routerV1 = router;
