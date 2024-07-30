import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

import { ApiError, ApiResponse, asyncHandler } from '@utils';

import { User } from '@models/user/user.model';
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

	// console.log('user', user.password);
	const match = await user.comparePassword(password);
	// console.log('match :: ', match);

	if (match) {
		response.json({ token: 'signin valid password, you are loggedin' });
	} else {
		response.json({ token: 'signin invalid password...you are not loggedin' });
	}
	// update user cookies as well
});

const signout = asyncHandler(async (request: Request, response: Response) => {
	response.json({ message: 'signout' });
});

const resetPassword = asyncHandler(async (request: Request, response: Response) => {
	response.json({ message: 'reset-password' });
});

export const authController = { signup, signin, signout, resetPassword };
