import mongoose from 'mongoose';

import * as constants from '@utils/constants';

const emailTemplateSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: constants.MODEL_NAMES.USER,
	},
	subject: {
		type: String,
		required: [true, 'Subject is required'],
	},
	salutation: {
		type: String,
	},
	body: {
		type: String,
		required: [true, 'Body is required'],
	},
	closing: {
		type: String,
	},
	signature: {
		type: String,
	},
});

export const EmailTemplate = mongoose.model(constants.MODEL_NAMES.EMAIL_TEMPLATE, emailTemplateSchema);
