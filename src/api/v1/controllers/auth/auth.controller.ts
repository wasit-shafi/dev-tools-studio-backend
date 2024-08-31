import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

import { ApiError, ApiResponse, asyncHandler } from '@utils';

import { _env } from '@config/environment';
import { User } from '@models/user/user.model';

import * as utils from '@utils/utils';
import * as constants from '@utils/constants';

const signup = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { firstName, lastName, email, password, mobileNumber, country, roles } = request.body;

	// TODO: append uuid to username
	const userName = firstName + '_' + lastName;

	const user = await User.findOne({ email });

	if (user) {
		next(new ApiError('Email Already Exists', constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT));
		return;
	}
	const newUser = await User.create({
		firstName,
		lastName,
		userName,
		email,
		password,
		mobileNumber,
		country,
		roles,
	});
	const accessToken = newUser.generateAccessToken();
	const refreshToken = newUser.generateRefreshToken();
	const cookieOptions = {
		secure: true,
		httpOnly: true,
		// expires: new Date(Date.now() + 900000000),
		// maxAge: 900000000000,
		// domain: 'localhost',
	};

	response
		.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.CREATED)
		.cookie('accessToken', accessToken, cookieOptions)
		.cookie('refreshToken', refreshToken, cookieOptions)
		.json(
			new ApiResponse(
				{ _id: newUser._id, accessToken, refreshToken },
				'Congratulations!! Account Created Successfully',
				constants.HTTP_STATUS_CODES.SUCCESSFUL.CREATED
			)
		);
});

const signin = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { userName, email, password } = request.body;

	// making sure user only send only userName or email not both

	if ('userName' in request.body && 'email' in request.body) {
		next(new ApiError('userName and email for login not allowed', constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT));
	}

	const user = await User.findOne({ $or: [{ email: email }, { userName: userName }] });

	if (!user) {
		// user not found
		next(new ApiError('Invalid username or password', constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));

		return;
	}

	const passwordMatched = await user.comparePassword(password);

	if (passwordMatched) {
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		const cookieOptions = {
			secure: true,
			httpOnly: true,
			// expires: new Date(Date.now() + 900000000),
			// maxAge: 900000000000,
			// domain: 'localhost',
		};

		response
			.cookie('accessToken', accessToken, cookieOptions)
			.cookie('refreshToken', refreshToken, cookieOptions)
			.json(new ApiResponse({ id: user._id, accessToken, refreshToken }));
	} else {
		next(new ApiError('Invalid username or password', constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
	}
});

const signout = asyncHandler(async (request: Request, response: Response) => {
	response.json({ message: 'signout' });
});

const resetPassword = asyncHandler(async (request: Request, response: Response) => {
	response.json({ message: 'reset-password' });
});

const refreshToken = asyncHandler(async (request: Request, response: Response) => {
	response.json({
		accessToken: 'new_access_token',
		refreshToken: 'new_refresh_token',
	});
});

export const authController = { signup, signin, signout, resetPassword };
