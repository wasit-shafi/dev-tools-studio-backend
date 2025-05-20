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
	displayName: {
		type: String,
		required: [true, 'Display Name is required'],
	},
	emailId: {
		type: String,
		required: [true, 'emailId is required'],
		unique: [true, 'emailId should be unique'],
		index: true,
	},
	host: {
		type: String,
		required: [true, 'host is required'],
	},
	port: {
		type: Number,
		required: [true, 'port is required'],
	},
	pass: {
		type: String,
		required: [true, 'pass is required'],
	},
});

export const Credential = mongoose.model(constants.MODEL_NAMES.CREDENTIAL, credentialSchema);
