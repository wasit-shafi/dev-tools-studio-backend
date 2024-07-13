import { z } from 'zod';

import bcrypt from 'bcrypt';

import mongoose, { Schema } from 'mongoose';

import * as constants from '@utils/constants';
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

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hashSync(user.password, salt);

	user.password = hash;
	return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	const user = this as IUser;

	return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

export const User = mongoose.model<IUser>(constants.MODEL_NAMES.USER, userSchema);
