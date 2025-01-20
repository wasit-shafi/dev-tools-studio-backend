import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';

import { ApiError, asyncHandler } from '@api/shared/utils';
import { _env } from '@environment';
import * as constants from '@utils/constants';

export interface IUserSignUp {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	countryCode: string;
	country: string;
	mobileNumber: string;
	reCaptcha: string;
}

export interface IUser extends Omit<IUserSignUp, 'confirmPassword'> {
	test: string;
	userName: string;
	displayName: string;
	devTools: any;
	roles: number[];
	passwordChangedAt: Date | null;
	passwordResetExpires: Date | null;
	passwordResetToken: string | null;
	refreshTokens: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IUserDocument extends IUser, mongoose.Document {
	comparePassword: Function;
	generateAccessToken: () => string;
	generateRefreshToken: () => string;
	generateResetPasswordToken: () => string;
}

const userSchema: Schema<IUserDocument> = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
		},

		lastName: {
			type: String,
			required: true,
		},

		displayName: {
			type: String,
			default: function () {
				return `${this.firstName.toLowerCase()} ${this.lastName.toLowerCase()}`;
			},
		},

		userName: {
			type: String,
			required: true,
			unique: true,
			default: function () {
				return `${this.firstName.toLowerCase()}-${this.lastName.toLowerCase()}-${uuidv7()}`;
			},
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

		countryCode: {
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

		passwordChangedAt: {
			type: Date,
		},

		passwordResetExpires: {
			type: Date,
		},

		passwordResetToken: {
			type: String,
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	let user = this as IUserDocument;

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

userSchema.post('save', function (error: any, document: Document, next: Function) {
	// console.log('error :: ', error);
	// console.log('document :: ', document);
	// console.log('next :: ', next);
	// TODO: handle here what to to with duplicate errors

	next(error.code === 11000 ? next(new ApiError(error.errmsg, constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT)) : error);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	const user = this as IUserDocument;
	return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

userSchema.methods.generateAccessToken = function () {
	const user = this as IUserDocument;
	const accessToken = jwt.sign(
		{ data: { id: user._id, email: user.email, userName: user.userName, roles: user.roles } },
		String(_env.get('ACCESS_TOKEN_SECRET')),
		{
			expiresIn: String(_env.get('ACCESS_TOKEN_EXPIRY')),
		}
	);

	return accessToken;
};

userSchema.methods.generateRefreshToken = function () {
	const user = this as IUserDocument;
	const refreshToken = jwt.sign({ data: { id: user._id } }, String(_env.get('REFRESH_TOKEN_SECRET')), {
		expiresIn: String(_env.get('REFRESH_TOKEN_EXPIRY')),
	});

	return refreshToken;
};

userSchema.methods.generateResetPasswordToken = function () {
	const resetPasswordToken = crypto.randomBytes(64).toString('hex');

	// saving the hashed resetPasswordToken in the database, so that even if the token which is saved in db gets exposed/leaked, no now is able to use it directly to reset password of the user
	this.passwordResetToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

	this.passwordResetExpires = Date.now() + constants.TIME.MS.MINUTE * 5; // valid for 5 mins only;

	return resetPasswordToken;
};

export const User = mongoose.model<IUserDocument>(constants.MODEL_NAMES.USER, userSchema);
