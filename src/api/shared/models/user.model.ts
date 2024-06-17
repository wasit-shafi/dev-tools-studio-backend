import mongoose from 'mongoose';

import * as constants from '../../shared/utils/constants';

const userSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model(constants.MODEL_NAMES.USER, userSchema);
