import mongoose from 'mongoose';

import * as constants from '@utils/constants';

const emailTemplateSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: constants.MODEL_NAMES.USER,
	},
	templateName: {
		type: String,
		required: [true, 'Template name is required'],
	},
	subject: {
		type: String,
		required: [true, 'Subject is required'],
	},
	salutation: {
		type: String,
		required: [true, 'Salutation is required'],
	},
	body: {
		type: String,
		required: [true, 'Body is required'],
	},
	closing: {
		type: String,
		required: [true, 'Closing is required'],
	},
	signature: {
		type: String,
		required: [true, 'Signature is required'],
	},
	tags: {
		type: [String],
		default: [],
		validate: {
			validator: function (tags: string[]) {
				return tags.every((tag) => !tag.includes(' ') && tag.startsWith('#') && !tag.endsWith('#'));
			},
			message: 'Tags are invalid, please try again',
		},
	},
});

export const EmailTemplate = mongoose.model(constants.MODEL_NAMES.EMAIL_TEMPLATE, emailTemplateSchema);
