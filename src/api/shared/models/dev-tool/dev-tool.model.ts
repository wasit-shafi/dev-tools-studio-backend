import mongoose from 'mongoose';

import * as constants from '@utils/constants';

const devToolSchema = new mongoose.Schema({
	// emailTemplates: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: constants.MODEL_NAMES.EMAIL_TEMPLATE,
	// 	required: true,
	// },
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: constants.MODEL_NAMES.USER,
	},
	palettes: {
		type: [],
		required: true,
	},
});

export const DevTool = mongoose.model(constants.MODEL_NAMES.DEV_TOOL, devToolSchema);
