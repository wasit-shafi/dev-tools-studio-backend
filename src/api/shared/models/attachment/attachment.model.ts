import mongoose from 'mongoose';

import * as constants from '@utils/constants';

const attachmentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: constants.MODEL_NAMES.USER,
	},
	attachmentName: {
		type: String,
		required: [true, 'Attachment Name is required'],
	},
	fileName: {
		type: String,
		required: [true, 'File Name is required'],
	},
});

export const Attachment = mongoose.model(constants.MODEL_NAMES.ATTACHMENT, attachmentSchema);
