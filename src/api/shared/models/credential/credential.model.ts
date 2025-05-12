import mongoose from 'mongoose';

import * as constants from '@utils/constants';

const credentialSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: constants.MODEL_NAMES.USER,
	},
	credentialType: {
		type: Number,
		required: [true, 'Credential Type is required'],
	},
	emailId: {
		type: String,
		required: [true, 'emailId is required'],
	},
	host: {
		type: String,
		required: [true, 'host is required'],
	},
	port: {
		type: Number,
		required: [true, 'port is required'],
	},
	user: {
		type: String,
		required: [true, 'user is required'],
	},
	pass: {
		type: String,
		required: [true, 'pass is required'],
	},
});

export const Credential = mongoose.model(constants.MODEL_NAMES.CREDENTIAL, credentialSchema);
