import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

import { ApiError, ApiResponse, asyncHandler } from '@utils';

import { _env } from '@config/environment';
import { User } from '@models/user/user.model';

import * as utils from '@utils/utils';
import * as constants from '@utils/constants';

const signup = asyncHandler(async (request: Request, response: Response) => {
	const { firstName = '', lastName = '', email = '', password = '', mobileNumber = '', country = '' } = request.body;
	const userName = firstName + '_' + lastName;

	// console.log('inside signup ... signup :: ', request.body);
	const newUser = await User.create({
		firstName,
		lastName,
		userName,
		email,
		password,
		mobileNumber,
		country,
	});
	response
		.status(constants.HTTP_STATUS_CODES.INFORMATIONAL.CREATED)
		.json(new ApiResponse({ _id: newUser._id }, 'new user created', constants.HTTP_STATUS_CODES.INFORMATIONAL.CREATED));
});

const signin = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { userName, email, password } = request.body;
	// console.log('request.body :: ', request.body);

	console.log({ userName, email, password });

	// making sure user only send only userName or email not both

	if ('userName' in request.body && 'email' in request.body) {
		next(new ApiError('userName and email for login not allowed', constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT));
	}

	const user = await User.findOne({ $or: [{ email: email }, { userName: userName }] });

	if (!user) {
		// user not found
		// response.json(new ApiError('Invalid username or password', constants.HTTP_STATUS_CODES.UNAUTHORIZED));
		next(new ApiError('Invalid username or password', constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));

		return;
	}

	const passwordMatched = await user.comparePassword(password);

	if (passwordMatched) {
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		const cookieOptions = { secure: true, httpOnly: true };
		response
			.cookie('accessToken', accessToken, cookieOptions)
			.cookie('refreshToken', refreshToken, cookieOptions)
			.json(new ApiResponse({ id: user._id, accessToken, refreshToken }));
	} else {
		response
			.status(constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED)
			.json(new ApiError('Invalid username/password', constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
	}
});

const signout = asyncHandler(async (request: Request, response: Response) => {
	response.json({ message: 'signout' });
});

const resetPassword = asyncHandler(async (request: Request, response: Response) => {
	response.json({ message: 'reset-password' });
});

export const authController = { signup, signin, signout, resetPassword };
