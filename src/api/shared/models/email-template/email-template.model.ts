import mongoose from 'mongoose';

import * as constants from '@utils/constants';

const emailTemplateSchema = new mongoose.Schema({
	subject: {
		type: String,
		required: true,
	},
	salutation: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	closing: {
		type: String,
		required: true,
	},
	signature: {
		type: String,
		required: true,
	},
	usedCount: {
		type: Number,
		required: true,
		default: 0,
	},
	lastUsedTimestamp: {
		type: Date,
		required: true,
	},
});

export const EmailTemplate = mongoose.model(constants.MODEL_NAMES.EMAIL_TEMPLATE, emailTemplateSchema);
