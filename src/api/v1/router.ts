import { Router } from 'express';

import { _env } from '@environment';
import { verifyJWT } from '@middlewares';
import * as constants from '@utils/constants';

import { authRouter, mailRouter, userRouter } from './routes';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: `Hello World - V1(${_env.get('NODE_ENV')})` });
});

router.use(constants.ROUTES._USER, verifyJWT, userRouter);

router.use(constants.ROUTES._MAIL, verifyJWT, mailRouter);

router.use(constants.ROUTES._AUTH, authRouter);

export const routerV1 = router;
