import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '@api/shared/models';
import { ApiError, asyncHandler, messages } from '@api/shared/utils';
import { _env } from '@environment';
import * as constants from '@utils/constants';

import { authRouter, mailRouter, userRouter } from './routes';

import type { RequestHandler, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: `Hello World - V1(${_env.get('NODE_ENV')})` });
	return;
});

const verifyJWT: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	try {
		// console.log('verifyJWT', {
		// 	accessTokenFromCookies: request.cookies.accessToken,
		// 	accessTokenFromHeaders: request.headers.authorization?.split('Bearer ')[1],
		// 	accessTokenFromBody: request.body.accessToken,
		// });

		// TODO: review the order for access token

		const accessToken = request.cookies.accessToken || request.headers.authorization?.split('Bearer ')[1] || request.body.accessToken;

		if (!accessToken) {
			next(new ApiError(messages.HTTP_STATUS.CLIENT.UNAUTHORIZED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
			return;
		}

		const accessTokenSecret = _env.get('ACCESS_TOKEN_SECRET') as string;
		const decoded: any = await jwt.verify(accessToken, accessTokenSecret);
		const user = await User.findById(decoded.data.id);

		if (!user) {
			next(new ApiError(messages.HTTP_STATUS.CLIENT.UNAUTHORIZED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
			return;
		}

		request.user = user;
		return next();
	} catch (err) {
		next(new ApiError(messages.HTTP_STATUS.CLIENT.UNAUTHORIZED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
		return;
	}
};

router.use(constants.ROUTES._USER, verifyJWT, userRouter);

router.use(constants.ROUTES._MAIL, mailRouter);

router.use(constants.ROUTES._AUTH, authRouter);

export const routerV1 = router;
