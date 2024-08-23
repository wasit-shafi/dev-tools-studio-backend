import mongoose from 'mongoose';

import * as constants from '@utils/constants';

interface IEmailTemplate extends mongoose.Document {
	subject: string;
	salutation: string;
	body: string;
	closing: string;
	signature: string;
	usedCount: number;
	lastUsedTimestamp: Date;
}

const emailTemplateSchema = new mongoose.Schema<IEmailTemplate>({
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

export const EmailTemplate = mongoose.model<IEmailTemplate>(constants.MODEL_NAMES.EMAIL_TEMPLATE, emailTemplateSchema);
