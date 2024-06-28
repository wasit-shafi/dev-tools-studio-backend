import mongoose, { Schema } from 'mongoose';

import * as constants from '../../shared/utils/constants';

interface IUser {
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

export const User = mongoose.model<IUser>(
	constants.MODEL_NAMES.USER,
	userSchema
);
