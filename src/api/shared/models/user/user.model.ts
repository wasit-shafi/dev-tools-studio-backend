import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema } from 'mongoose';
import { v7 as uuidv7 } from 'uuid';

import { _env } from '@environment';
import { ApiError, asyncHandler, logger, MESSAGES, MONGODB_ERROR_CODES } from '@utils';
import * as constants from '@utils/constants';

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
		},

		lastName: {
			type: String,
			required: true,
		},

		displayName: {
			type: String,
			default: function () {
				return 'firstName' in this && 'lastName' in this ? `${this.firstName.toLowerCase()} ${this.lastName.toLowerCase()}` : '';
			},
		},

		userName: {
			type: String,
			required: true,
			unique: true,
			index: true,
			default: function () {
				return 'firstName' in this && 'lastName' in this
					? `${this.firstName.toLowerCase()}-${this.lastName.toLowerCase()}-${uuidv7()}`
					: '';
			},
		},

		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},

		password: {
			type: String,
			required: true,
		},

		countryCode: {
			type: String,
			required: true,
		},

		mobileNumber: {
			type: String,
			required: true,
		},

		country: {
			type: String,
			required: true,
		},

		refreshTokens: {
			type: [String],
			required: true,
			default: [],
		},

		roles: {
			type: [Number],
			required: true,
		},

		passwordChangedAt: {
			type: Date,
		},

		passwordResetExpires: {
			type: Number, // timestamp
		},

		passwordResetToken: {
			type: String,
		},
	},
	{
		// NOTE(WASIT): why methods are written inside schema and not outside, refer https://mongoosejs.com/docs/guide.html#methods

		methods: {
			async comparePassword(candidatePassword: string): Promise<boolean> {
				const user = this;

				return bcrypt.compare(candidatePassword, user.password).catch(() => false);
			},

			generateAccessToken() {
				const user = this;

				return jwt.sign(
					{ data: { id: user._id, email: user.email, userName: user.userName, roles: user.roles } },
					String(_env.get('ACCESS_TOKEN_SECRET')),
					{
						expiresIn: String(_env.get('ACCESS_TOKEN_EXPIRY')),
					}
				);
			},

			generateRefreshToken() {
				const user = this;

				return jwt.sign({ data: { id: user._id } }, String(_env.get('REFRESH_TOKEN_SECRET')), {
					expiresIn: String(_env.get('REFRESH_TOKEN_EXPIRY')),
				});
			},

			generateResetPasswordToken() {
				const resetPasswordToken = crypto.randomBytes(64).toString('hex');

				// saving the hashed resetPasswordToken in the database, so that even if the token which is saved in db gets exposed/leaked, no now is able to use it directly to reset password of the user

				this.passwordResetToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');
				this.passwordResetExpires = Date.now() + constants.TIME.MS.MINUTE * 5; // valid for 5 mins only;

				return resetPasswordToken;
			},
		},
		// Referred below links for more info about toJSON/toObject mongoose:
		// https://mongoosejs.com/docs/api/document.html#Document.prototype.toObject()
		// https://mongoosejs.com/docs/api/document.html#transform
		// https://stackoverflow.com/a/57613179/10249156
		// https://github.com/Automattic/mongoose/issues/2072
		// https://medium.com/@vikramgyawali57/hiding-credentials-in-response-with-mongoose-and-nodejs-a5d591b373e6

		toJSON: {
			versionKey: false,

			transform: function (document, returnObject) {
				delete returnObject.password;
				delete returnObject.passwordChangedAt;
				delete returnObject.passwordResetToken;
				delete returnObject.passwordResetExpires;

				delete returnObject.refreshTokens;

				delete returnObject.updatedAt;
				delete returnObject.createdAt;

				return returnObject;
			},
		},

		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	let user = this;

	if (!user.isModified('password')) {
		next();
		return;
	}

	const saltRounds: number = Number(_env.get('SALT_ROUNDS'));
	const salt = bcrypt.genSaltSync(saltRounds);

	user.password = bcrypt.hashSync(user.password, salt);

	next();
});

userSchema.post('save', function (error: unknown, document: Document, next: Function) {
	// console.log('\n\nerror :: ', error);
	// console.log('\n\ndocument :: ', document);

	// backup handling of error if some use-case is not covered from the zod validations/express controllers

	if (error) {
		let mongodbErrorCode: number = -1;
		let errorMessage: string;
		let errorCode: number;

		if (error instanceof Object && 'code' in error && typeof error.code === 'number') {
			mongodbErrorCode = error.code;
		}

		switch (mongodbErrorCode) {
			case MONGODB_ERROR_CODES.DUPLICATE_KEY:
				errorMessage = MESSAGES.SHARED.DUPLICATE_ENTRY_FOUND;
				errorCode = constants.HTTP_STATUS_CODES.CLIENT_ERROR.CONFLICT;
				break;

			default:
				errorMessage = MESSAGES.SHARED.SOMETHING_WENT_WRONG;
				errorCode = constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST;

				logger.info('default case of switch: mongodbErrorCode :', mongodbErrorCode);
		}
		next(new ApiError(errorMessage, errorCode));
		return;
	}

	next();
});

export const User = mongoose.model(constants.MODEL_NAMES.USER, userSchema);
