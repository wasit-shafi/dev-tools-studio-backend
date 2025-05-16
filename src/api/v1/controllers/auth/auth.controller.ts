import crypto from 'crypto';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

import { _env } from '@config/environment';
import { IEmailOptions } from '@interfaces';
import { emailQueue } from '@messageQueue';
import { User } from '@models';
import {
    ApiError, ApiResponse, asyncHandler, getHeadersForAvoidEmailGrouping, logger, MESSAGES, sendSms
} from '@utils';
import * as constants from '@utils/constants';
import * as utils from '@utils/utils';

import type { NextFunction, Request, RequestHandler, Response } from 'express';

const signup: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { firstName, lastName, email, password, countryCode, mobileNumber, country } = request.body;

	const user = await User.findOne({ email });

	if (user) {
		next(new ApiError(MESSAGES.AUTH.EMAIL_EXISTS_ERROR, constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT));
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
		.json(new ApiResponse(MESSAGES.AUTH.SIGNUP_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.CREATED, { _id: newUser._id }));
});

const signin: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { userName, email, password } = request.body;

	// making sure user only send only userName or email not both

	if ('userName' in request.body && 'email' in request.body) {
		next(new ApiError(MESSAGES.AUTH.EMAIL_AND_USERNAME_CONFLICT_FOR_SIGNIN, constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT));
		return;
	}

	const user = await User.findOne({ $or: [{ email: email }, { userName: userName }] });

	const passwordMatched = user ? await user.comparePassword(password) : false;

	if (user && passwordMatched) {
		// TODO(Wasit): consider making it on function generateAuthTokens/generateAccessAndRefreshTokens etc

		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

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
			.json(
				new ApiResponse(MESSAGES.SHARED.SIGNIN_SUCCESSFUL, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, {
					user: { ...user.toJSON(), accessToken, refreshToken },
				})
			);
		return;
	}

	next(new ApiError(MESSAGES.AUTH.INVALID_USERNAME_OR_PASSWORD, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
});

const getMe: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	// NOTE(Wasit): refetching the user although we have it in request.user, just to  make use of user.toJson() in-order to sync with the other APIs specially login API

	const user = await User.findById(request.user._id);

	if (!user) {
		next(new ApiError(MESSAGES.AUTH.USER_FETCH_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	response
		.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK)
		.json(new ApiResponse(MESSAGES.AUTH.USER_FETCH_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { user: user.toJSON() }));
});

const refresh: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	// NOTE(Wasit): refetching the user although we have it in request.user, just to  make use of user.toJson() in-order to sync with the other APIs specially login API

	const user = await User.findById(request.user._id);

	if (!user) {
		next(new ApiError(MESSAGES.AUTH.INVALID_RESET_PASSWORD_ATTEMPT, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	const accessToken = await user.generateAccessToken();
	const refreshToken = await user.generateRefreshToken();

	user.refreshTokens = user.refreshTokens.filter((refreshToken) => refreshToken !== request.refreshToken);
	user.save();

	response.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK).json(
		new ApiResponse(MESSAGES.AUTH.REFRESH_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, {
			user: { ...user.toJSON(), accessToken, refreshToken },
		})
	);
});

const signout: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const user = await User.findOne({ _id: request.user._id, accessTokens: { $in: request.accessToken } });

	if (!user) {
		next(new ApiError(MESSAGES.AUTH.SIGNOUT_FAILED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	user.accessTokens = user.accessTokens.filter((accessToken) => accessToken !== request.accessToken);
	// TODO(Wasit): Temporarily removing all the refresh tokens on signout

	user.refreshTokens = [];
	await user.save();

	response
		.clearCookie('accessToken')
		.clearCookie('refreshToken')
		.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK)
		.json(new ApiResponse(MESSAGES.AUTH.SIGNOUT_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
});

const forgotPassword: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const {
		ipinfo,
		body: { email },
	} = request;

	const user = await User.findOne({
		email,
	});

	if (!user) {
		response.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK).json(new ApiResponse(MESSAGES.AUTH.PASSWORD_RESET_MAIL_SENT, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
		return;
	}

	const { firstName } = user;
	const resetPasswordLink = `${_env.get('FE_BASE_URL')}/reset-password?token=${await user.generateResetPasswordToken()}`;

	const when = new Date().toUTCString();
	const device = utils.getDeviceInfoString(request.headers['user-agent'] || '');
	const near = utils.getIpInfoString(ipinfo);

	const latitude = ipinfo && !ipinfo?.bogon ? ipinfo.loc.split(',')[0] : '';
	const longitude = ipinfo && !ipinfo?.bogon ? ipinfo.loc.split(',')[1] : '';

	const staticMapUrl = utils.getStaticMapUrl({
		latitude,
		longitude,
	});
	const googleMapUrl = utils.getGoogleMapUrl({
		latitude,
		longitude,
	});

	const countryFlagUrl = utils.getCountryFlagUrl(constants.FLAG_CDN_ICON_SIZE.W20H15, ipinfo?.countryCode);

	ejs.renderFile(
		path.join(__dirname, '../../../../templates/reset-password.ejs'),
		{
			firstName,
			resetPasswordLink,
			when,
			device,
			near,
			staticMapUrl,
			googleMapUrl,
			countryFlagUrl,
		},
		async (error, templateHtmlString) => {
			if (error) {
				next(new ApiError(MESSAGES.SHARED.SOMETHING_WENT_WRONG, constants.HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR));
				return;
			}

			const emailOptions: IEmailOptions = {
				from: `${_env.get('EMAIL_SERVICE_SENDER_NAME')}<${_env.get('EMAIL_SERVICE_SENDER_EMAIL_ID')}>`,
				to: email,
				subject: 'Reset Your Password',
				html: templateHtmlString,
				headers: { ...getHeadersForAvoidEmailGrouping() },
			};

			await emailQueue.add(constants.MESSAGING_QUEUES.EMAIL, {
				emailOptions,
				emailType: constants.EMAIL_TYPES.APPLICATION,
			});

			response.json(new ApiResponse(MESSAGES.AUTH.PASSWORD_RESET_MAIL_SENT, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
		}
	);
});

const resetPassword: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
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
		response.json(new ApiResponse(MESSAGES.AUTH.PASSWORD_RESET_MAIL_SENT, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
		return;
	}

	next(new ApiError(MESSAGES.AUTH.INVALID_RESET_PASSWORD_ATTEMPT, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
});

export const authController = { signup, signin, signout, forgotPassword, resetPassword, getMe, refresh };
