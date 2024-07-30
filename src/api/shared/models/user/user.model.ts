import { z } from 'zod';

import bcrypt from 'bcrypt';

import mongoose, { Schema } from 'mongoose';

import * as constants from '@utils/constants';
import { ApiError } from '@api/shared/utils';

import { _env } from '@environment';
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
	devTools: [];
	createdAt: Date;
	updatedAt: Date;
	// TODO: review how to avoid adding comparePassword in interface here...
	comparePassword: Function;
}

const userSchema: Schema<IUser> = new Schema(
	{
		firstName: {
			type: String,
			required: true,
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

		devTools: {
			type: [],
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

	next(
		error.code === 11000 ? next(new ApiError(error.errmsg, constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT)) : error
	);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	const user = this as IUser;
	// console.log(
	// 	'inside comparePassword :: candidatePassword :: ',
	// 	candidatePassword,
	// 	'__user.password :: ',
	// 	user.password
	// );

	return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

export const User = mongoose.model<IUser>(constants.MODEL_NAMES.USER, userSchema);
