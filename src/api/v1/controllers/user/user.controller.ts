import fs from 'fs';

import { _env } from '@environment';
import { IEmailOptions, ISendUserEmail } from '@interfaces';
import { emailQueue } from '@messageQueue';
import { Attachment, Credential, EmailTemplate, User } from '@models';
import {
    ApiError, ApiResponse, asyncHandler, deleteFromS3, generateFilePathForUser, generatePresignedUrl,
    getHeadersForAvoidEmailGrouping, MESSAGES, uploadToS3
} from '@utils';
import * as constants from '@utils/constants';

import type { Request, Response, NextFunction, RequestHandler } from 'express';
// Credential

const addNewCredential: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { credentialType, displayName, emailId, host, port, pass } = request.body;

	const newCredential = await Credential.create({
		userId: request.user._id,
		credentialType,
		displayName,
		emailId,
		host,
		port,
		pass,
	});

	response.json(new ApiResponse(MESSAGES.USER.ADD_CREDENTIAL_SUCCESS, constants.HTTP_STATUS_CODES.INFORMATIONAL.CREATED, { _id: newCredential._id }));
});

const getCredential: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const credential = await Credential.findOne({ userId: request.user._id, _id: request.params._id }).select('-userId -__v');

	if (!credential) {
		next(new ApiError(MESSAGES.USER.GET_CREDENTIAL_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	response.json(new ApiResponse(MESSAGES.USER.GET_CREDENTIAL_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { credential }));
});

const deleteCredential: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const credential = await Credential.findOneAndDelete({ userId: request.user._id, _id: request.params._id });

	if (!credential) {
		next(new ApiError(MESSAGES.USER.DELETE_CREDENTIAL_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
		return;
	}

	response.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK).json(new ApiResponse(MESSAGES.USER.DELETE_CREDENTIAL_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
});

const patchCredential: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const updatedCredential = await Credential.findOneAndUpdate({ userId: request.user._id, _id: request.params._id }, { ...request.body }, { new: true })
		.select('-userId -__v')
		.lean();

	if (!updatedCredential) {
		next(new ApiError(MESSAGES.USER.PATCH_CREDENTIAL_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
		return;
	}

	response.json(new ApiResponse(MESSAGES.USER.PATCH_CREDENTIAL_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { _id: updatedCredential._id }));
});
// Credential List

const getCredentialList: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const credentialList = await Credential.find({ userId: request.user._id }).select('-userId -__v');

	response
		.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK)
		.json(new ApiResponse(MESSAGES.USER.GET_CREDENTIAL_LIST_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { credentialList }));
});
// Email Template

const addNewEmailTemplate: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { templateName, subject, salutation, body, closing, signature, tags } = request.body;

	const newEmailTemplate = await EmailTemplate.create({ userId: request.user._id, templateName, subject, salutation, body, closing, signature, tags });

	response
		.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.CREATED)
		.json(new ApiResponse(MESSAGES.USER.ADD_EMAIL_TEMPLATE_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.CREATED, { _id: newEmailTemplate._id }));
});

const getEmailTemplate: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const emailTemplate = await EmailTemplate.findOne({ userId: request.user._id, _id: request.params._id }).select('-userId -__v');

	if (!emailTemplate) {
		next(new ApiError(MESSAGES.USER.GET_EMAIL_TEMPLATE_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	response.json(new ApiResponse(MESSAGES.USER.GET_EMAIL_TEMPLATE_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { emailTemplate }));
});

const patchEmailTemplate: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const updatedEmailTemplate = await EmailTemplate.findOneAndUpdate({ userId: request.user._id, _id: request.params._id }, { ...request.body }, { new: true })
		.select('-userId -__v')
		.lean();

	if (!updatedEmailTemplate) {
		next(new ApiError(MESSAGES.USER.PATCH_EMAIL_TEMPLATE_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
		return;
	}

	response.json(new ApiResponse(MESSAGES.USER.PATCH_EMAIL_TEMPLATE_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { _id: updatedEmailTemplate._id }));
});

const deleteEmailTemplate: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const emailTemplate = await EmailTemplate.findOneAndDelete({ userId: request.user._id, _id: request.params._id });

	if (!emailTemplate) {
		next(new ApiError(MESSAGES.USER.DELETE_EMAIL_TEMPLATE_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
		return;
	}

	response.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK).json(new ApiResponse(MESSAGES.USER.DELETE_EMAIL_TEMPLATE_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
});
// Email Template List

const getEmailTemplateList: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const emailTemplateList = await EmailTemplate.find({ userId: request.user._id }).select('-userId -__v');

	response
		.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK)
		.json(new ApiResponse(MESSAGES.USER.GET_EMAIL_TEMPLATE_LIST_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { emailTemplateList }));
});
// Post Email

const postEmail: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	let delay: number = 0;
	const { from, sendNow, dateTimeLocal, to, subject, salutation, body, closing, signature, attachmentIds = [], receiveConfirmationEmail } = request.body;
	if (!sendNow) {
		const targetDateAndTime = new Date(dateTimeLocal);
		delay = Number(targetDateAndTime) - Number(new Date());
	}

	if (delay < 0) {
		next(new ApiError(MESSAGES.SHARED.INVALID_DATE_AND_TIME, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_ACCEPTABLE));
		return;
	}

	const credential = await Credential.findOne({
		userId: request.user._id,
		emailId: from,
	})
		.select('-_id -userId -__v')
		.lean();

	const attachmentDetails = await Attachment.find(
		{
			_id: {
				$in: attachmentIds,
			},
		},
		{
			_id: 0,
			userId: 1,
			fileName: 1,
		}
	).lean();
	// TODO(Wasit): review how get the string userId instead of ObjectId()

	const transformedAttachmentDetails = attachmentDetails.map((attachment) => ({ ...attachment, userId: attachment.userId.toString() }));

	if (!credential || attachmentDetails.length !== attachmentIds.length) {
		next(new ApiError(MESSAGES.USER.EMAIL_SCHEDULED_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	// NOTE(Wasit): Keep the html format in sync with frontend (email preview)

	const html = `<p style="white-space:pre-wrap">${salutation}<br/>${body}<br/>${closing}<br/><br/>${signature}</p>`;

	const emailOptions: IEmailOptions = {
		from: `"${credential.displayName}" <${from}>`,
		to,
		subject,
		html,
		headers: { ...getHeadersForAvoidEmailGrouping() },
	};

	const data: ISendUserEmail = {
		credential,
		emailOptions,
		receiveConfirmationEmail,
		...(receiveConfirmationEmail && { userEmailId: request.user.email }),
		emailType: constants.EMAIL_TYPES.USER,
		_id: request.user._id,
		attachmentDetails: transformedAttachmentDetails,
	};
	await emailQueue.add(constants.MESSAGING_QUEUES.EMAIL, data, { delay });

	response.json(new ApiResponse(MESSAGES.BULL_MQ.EMAIL.EMAIL_SCHEDULED_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
});

const postProfilePicture: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const {
		file,
		user: { _id },
	} = request;

	if (!file) {
		next(new ApiError(MESSAGES.USER.NO_PROFILE_PICTURE_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	await uploadToS3({
		key: `${generateFilePathForUser({
			_id,
			type: constants.S3_FILE_TYPES.USER_PROFILE_PICTURE,
		})}${file.filename}`,
		filePath: file.path,
	});
	fs.unlinkSync(file.path);

	await User.findByIdAndUpdate(_id, {
		profilePicture: file.filename,
	});
	// Cleanup : delete temp file from server & delete previous uploaded profile picture if exists

	const oldProfilePicture = request.user.profilePicture;

	if (oldProfilePicture) {
		await deleteFromS3({
			key: `${generateFilePathForUser({
				_id,
				type: constants.S3_FILE_TYPES.USER_PROFILE_PICTURE,
			})}${oldProfilePicture}`,
		});
	}

	const presignedUrl = await generatePresignedUrl({
		key: `${generateFilePathForUser({ _id, type: constants.S3_FILE_TYPES.USER_PROFILE_PICTURE })}${file.filename}`,
		operation: constants.CLIENT_S3_OPERATIONS.GET_OBJECT,
	});

	response.json(new ApiResponse(MESSAGES.USER.ADD_PROFILE_PICTURE_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { profilePicture: presignedUrl }));
});

const deleteProfilePicture: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const {
		user: { _id, profilePicture },
	} = request;

	if (!profilePicture) {
		next(new ApiError(MESSAGES.USER.NO_PROFILE_PHOTO_EXISTS, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	await Promise.all([
		User.updateOne({ _id }, { $unset: { profilePicture: 1 } }),
		deleteFromS3({
			key: `${generateFilePathForUser({
				_id,
				type: constants.S3_FILE_TYPES.USER_PROFILE_PICTURE,
			})}${profilePicture}`,
		}),
	]);

	response.json(new ApiResponse(MESSAGES.USER.DELETE_PROFILE_PICTURE_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
});

const postAttachment: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const {
		file,
		user: { _id },
	} = request;

	if (!file) {
		next(new ApiError(MESSAGES.USER.NO_ATTACHMENT_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	await uploadToS3({
		key: `${generateFilePathForUser({
			_id,
			type: constants.S3_FILE_TYPES.USER_ATTACHMENT,
		})}${file.filename}`,
		filePath: file.path,
	});
	fs.unlinkSync(file.path);

	await Attachment.create({ userId: _id, fileName: file.filename, attachmentName: request.body.attachmentName });

	response.json(new ApiResponse(MESSAGES.USER.ATTACHMENT_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
});

const deleteAttachment: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const {
		user: { _id },
	} = request;
	const attachment = await Attachment.findOneAndDelete({ userId: _id, _id: request.params._id });

	if (!attachment) {
		next(new ApiError(MESSAGES.USER.DELETE_ATTACHMENT_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
		return;
	}

	await deleteFromS3({
		key: `${generateFilePathForUser({
			_id,
			type: constants.S3_FILE_TYPES.USER_ATTACHMENT,
		})}${attachment.fileName}`,
	});

	response.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK).json(new ApiResponse(MESSAGES.USER.DELETE_ATTACHMENT_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
});

const getAttachmentList: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const attachmentList = await Attachment.find({ userId: request.user._id }).select('-userId -__v');

	response.json(new ApiResponse(MESSAGES.USER.GET_ATTACHMENT_LIST_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { attachmentList }));
});

export const userController = {
	addNewCredential,
	addNewEmailTemplate,
	deleteAttachment,
	deleteCredential,
	deleteEmailTemplate,
	getAttachmentList,
	getCredential,
	getCredentialList,
	getEmailTemplate,
	getEmailTemplateList,
	patchCredential,
	patchEmailTemplate,
	postAttachment,
	postEmail,
	postProfilePicture,
	deleteProfilePicture,
};
