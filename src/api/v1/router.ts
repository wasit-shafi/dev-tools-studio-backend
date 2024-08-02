import { Router } from 'express';

import type { RequestHandler, Request, Response, NextFunction } from 'express';

import { _env } from '@environment';
import { mailRouter, userRouter, authRouter } from './routes';

import * as constants from '@utils/constants';
import { ApiError, asyncHandler } from '@api/shared/utils';
import jwt from 'jsonwebtoken';
import { User } from '@api/shared/models';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: `Hello World - V1(${_env.get('NODE_ENV')})` });
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
			next(new ApiError('You are not authorized', constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
			return;
		}

		const accessTokenSecret = _env.get('ACCESS_TOKEN_SECRET') as string;
		const decoded: any = await jwt.verify(accessToken, accessTokenSecret);
		const user = await User.findById(decoded.data.id);

		if (!user) {
			next(new ApiError('You are not authorized', constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
			return;
		}

		request.user = user;
		return next();
	} catch (err) {
		next(new ApiError('You are not authorized', constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
		return;
	}
};

router.use(constants.ROUTES.USER, verifyJWT, userRouter);

router.use(constants.ROUTES.MAIL, mailRouter);

router.use(constants.ROUTES.AUTH, authRouter);

export const routerV1 = router;
