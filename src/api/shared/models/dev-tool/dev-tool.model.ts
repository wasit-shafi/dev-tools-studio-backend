import mongoose, { Types } from 'mongoose';

import * as constants from '@utils/constants';
import { any } from 'zod';

interface IDevTool extends mongoose.Document {
	// emailTemplates: mongoose.Types.ObjectId;
	userId: Types.ObjectId;
	palettes: any;
}

export const devToolSchema = new mongoose.Schema<IDevTool>({
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

export const DevTool = mongoose.model<IDevTool>(constants.MODEL_NAMES.ROLE, devToolSchema);
