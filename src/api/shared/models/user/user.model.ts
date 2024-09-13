import jwt from 'jsonwebtoken';

import { z } from 'zod';

import bcrypt from 'bcrypt';

import mongoose, { Schema, Types } from 'mongoose';

import * as constants from '@utils/constants';
import { ApiError, asyncHandler } from '@api/shared/utils';

import { _env } from '@environment';
import { devToolSchema } from '../dev-tool/dev-tool.model';

// import { userZodSchema } from '../../schema/user/user.schema';

interface IUser extends mongoose.Document {
	firstName: string;
	lastName: string;
	userName: string;
	displayName: string;
	email: string;
	password: string;
	mobileNumber: string;
	country: string;
	devTools: any;
	roles: number[];
	refreshTokens: string[];
	createdAt: Date;
	updatedAt: Date;
	// TODO: review how to avoid adding comparePassword in interface here...
	comparePassword: Function;
	generateAccessToken: Function;
	generateRefreshToken: Function;
}

const userSchema: Schema<IUser> = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'firstName is required'],
		},

		lastName: {
			type: String,
			required: true,
		},

		displayName: {
			type: String,
			default: function () {
				const _this = this as any;
				return _this.firstName + ' ' + _this.lastName;
			},
		},

		userName: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},

		password: {
			type: String,
			required: true,
		},

		mobileNumber: {
			type: String,
			required: true,
		},

		country: {
			type: String,
			required: true,
		},
		refreshTokens: {
			type: [String],
			required: true,
			default: [],
		},
		roles: {
			type: [Number],
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	let user = this as IUser;

	if (!user.isModified('password')) {
		return next();
	}

	const saltRounds: number = Number(_env.get('SALT_ROUNDS'));
	const salt = bcrypt.genSaltSync(saltRounds);

	const password: string = user.password;
	const hashedPassword = bcrypt.hashSync(password, salt);

	user.password = hashedPassword;

	return next();
});

userSchema.post('save', function (error: any, document: any, next: any) {
	// console.log('error :: ', error);
	// console.log('document :: ', document);
	// console.log('next :: ', next);

	next(error.code === 11000 ? next(new ApiError(error.errmsg, constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT)) : error);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	const user = this as IUser;
	return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

userSchema.methods.generateAccessToken = function () {
	const user = this as IUser;
	const accessToken = jwt.sign(
		{ data: { id: user._id, email: user.email, userName: user.userName, roles: user.roles } },
		_env.get('ACCESS_TOKEN_SECRET') as string,
		{
			expiresIn: _env.get('ACCESS_TOKEN_EXPIRY') as string,
		}
	);

	return accessToken;
};

userSchema.methods.generateRefreshToken = function () {
	const user = this as IUser;
	const refreshToken = jwt.sign({ data: { id: user._id } }, _env.get('REFRESH_TOKEN_SECRET') as string, {
		expiresIn: _env.get('REFRESH_TOKEN_EXPIRY') as string,
	});

	return refreshToken;
};

export const User = mongoose.model<IUser>(constants.MODEL_NAMES.USER, userSchema);
