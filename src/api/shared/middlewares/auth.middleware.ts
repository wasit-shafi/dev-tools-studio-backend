import jwt from 'jsonwebtoken';

import { _env } from '@environment';
import { User } from '@models';
import { ApiError, asyncHandler, MESSAGES } from '@utils';
import * as constants from '@utils/constants';

import type { RequestHandler, Request, Response, NextFunction } from 'express';

export const verifyAccessToken: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	// logger.info('verifyAccessToken :: ', {
	// 	accessTokenFromCookies: request.cookies.accessToken,
	// 	accessTokenFromHeaders: request.headers.authorization?.split('Bearer ')[1],
	// 	accessTokenFromBody: request.body.accessToken,
	// });

	// TODO(WASIT): review the order for access token

	const accessToken = request.cookies.accessToken || request.headers.authorization?.split('Bearer ')[1] || request.body.accessToken;

	if (!accessToken) {
		next(new ApiError(MESSAGES.HTTP_STATUS.CLIENT.UNAUTHORIZED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
		return;
	}

	let user = null;
	const accessTokenSecret = String(_env.get('ACCESS_TOKEN_SECRET'));

	const decoded: unknown = jwt.verify(accessToken, accessTokenSecret);

	if (decoded !== null && decoded instanceof Object && 'data' in decoded && decoded.data !== null && decoded.data instanceof Object && '_id' in decoded.data) {
		user = await User.findOne({
			_id: decoded.data._id,
			accessTokens: { $in: accessToken },
		}).select('-password');
	}

	if (!user) {
		next(new ApiError(MESSAGES.HTTP_STATUS.CLIENT.UNAUTHORIZED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
		return;
	}

	request.user = user;
	request.accessToken = accessToken;
	next();
});

export const verifyRefreshToken: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const refreshToken = request.cookies?.refreshToken || request.body?.refreshToken;

	if (!refreshToken) {
		next(new ApiError(MESSAGES.HTTP_STATUS.CLIENT.UNAUTHORIZED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
		return;
	}

	let user = null;
	const refreshTokenSecret = String(_env.get('REFRESH_TOKEN_SECRET'));
	const decoded: unknown = jwt.verify(refreshToken, refreshTokenSecret);

	if (decoded !== null && decoded instanceof Object && 'data' in decoded && decoded.data !== null && decoded.data instanceof Object && '_id' in decoded.data) {
		user = await User.findOne({
			_id: decoded.data._id,
			refreshTokens: { $in: refreshToken },
		}).select('-password');
	}
	if (!user) {
		next(new ApiError(MESSAGES.HTTP_STATUS.CLIENT.UNAUTHORIZED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
		return;
	}

	request.user = user;
	request.refreshToken = refreshToken;
	next();
});
