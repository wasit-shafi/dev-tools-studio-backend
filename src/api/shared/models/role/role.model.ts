import mongoose from 'mongoose';

import * as constants from '@utils/constants';

interface IRole extends mongoose.Document {
	role: number;
	type: string;
}

const roleSchema = new mongoose.Schema<IRole>({
	role: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
});

export const Roles = mongoose.model<IRole>(constants.MODEL_NAMES.ROLE, roleSchema);
