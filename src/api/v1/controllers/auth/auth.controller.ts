import crypto from 'crypto';
import ejs from 'ejs';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

import { _env } from '@config/environment';
import { emailQueue } from '@messageQueue';
import { User } from '@models/user/user.model';
import { ApiError, ApiResponse, asyncHandler, messages, sendSms } from '@utils';
import * as constants from '@utils/constants';
import * as utils from '@utils/utils';

import type { NextFunction, Request, Response } from 'express';
const signup = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { firstName, lastName, email, password, countryCode, mobileNumber, country } = request.body;

	const user = await User.findOne({ email });

	if (user) {
		next(new ApiError(messages.AUTH.EMAIL_EXISTS_ERROR, constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT));
		return;
	}

	const newUser = await User.create({
		country,
		countryCode,
		email,
		firstName,
		lastName,
		mobileNumber,
		password,
		roles: [constants.USER_ROLES.APP_USER],
	});

	response
		.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.CREATED)
		.json(new ApiResponse({ _id: newUser._id }, messages.AUTH.SIGNUP_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.CREATED));
});

const signin = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { userName, email, password } = request.body;

	// making sure user only send only userName or email not both

	if ('userName' in request.body && 'email' in request.body) {
		next(new ApiError(messages.AUTH.EMAIL_AND_USERNAME_CONFLICT_FOR_SIGNIN, constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT));
	}

	const user = await User.findOne({ $or: [{ email: email }, { userName: userName }] });

	if (!user) {
		// user not found
		next(new ApiError(messages.AUTH.INVALID_USERNAME_OR_PASSWORD, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));

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
			.json(new ApiResponse({ id: user._id, accessToken, refreshToken, roles: user.roles }));
	} else {
		next(new ApiError(messages.AUTH.INVALID_USERNAME_OR_PASSWORD, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
	}
});

const signout = asyncHandler(async (request: Request, response: Response) => {
	response.json({ message: messages.AUTH.SIGNOUT_SUCCESS });
});

const forgotPassword = asyncHandler(async (request: Request, response: Response) => {
	const { email } = request.body;

	const user = await User.findOne({
		email,
	});

	if (user) {
		const templateString = fs.readFileSync(path.join(__dirname, '../../../../templates/reset-password.ejs'), 'utf-8');

		const resetPasswordLink = `${_env.get('FE_BASE_URL')}/reset-password?token=${user.generateResetPasswordToken()}`;
		await user.save();

		await emailQueue.add(constants.MESSAGING_QUEUES.EMAIL, {
			emailOptions: {
				from: `Dev Tools Studio<noReply@devToolsStudio.com>`,
				to: email,
				subject: 'Reset Your Password',
				html: ejs.render(templateString, {
					firstName: user.firstName,
					resetPasswordLink,
					when: 'Dec 29, 2024 01:00 AM India Standard Time',
					device: 'Mozilla Firefox Windows (Desktop)',
					near: 'National Capital Territory of Delhi, India',
				}),
			},
		});
	}

	response.json(
		new ApiResponse(
			null,
			'If an account with this email exists, a password reset link has been sent. Please check your inbox and follow the instructions.'
		)
	);
});

const resetPassword = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { password } = request.body;
	const { token = '' } = request.params;

	const user = await User.findOne({
		passwordResetToken: crypto.createHash('sha256').update(token).digest('hex'),
		passwordResetExpires: { $gt: Date.now() },
	});

	if (user) {
		user.password = password;
		user.passwordResetToken = null;
		user.passwordResetExpires = null;
		user.passwordChangedAt = new Date();
		await user.save();
		return response.json(new ApiResponse(null, 'Password reset successful, please login with your new password'));
	}

	next(new ApiError('This password reset attempt is no longer valid, please request a new link and try again', 400));
});

const refreshToken = asyncHandler(async (request: Request, response: Response) => {
	response.json({
		accessToken: 'new_access_token',
		refreshToken: 'new_refresh_token',
	});
});

export const authController = { signup, signin, signout, resetPassword, forgotPassword };
