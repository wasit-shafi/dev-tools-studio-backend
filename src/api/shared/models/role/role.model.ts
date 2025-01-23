import mongoose from 'mongoose';

import * as constants from '@utils/constants';

const roleSchema = new mongoose.Schema({
	role: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
});

export const Role = mongoose.model(constants.MODEL_NAMES.ROLE, roleSchema);
