import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { _env } from '@environment';
import { IEmailOptions, ISendUserEmail } from '@interfaces';
import { emailQueue } from '@messageQueue';
import { Credential, EmailTemplate } from '@models';
import { ApiError, ApiResponse, asyncHandler, getHeadersForAvoidEmailGrouping, MESSAGES } from '@utils';
import * as constants from '@utils/constants';

// Credential

const addNewCredential: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { credentialType, displayName, emailId, host, port, user, pass } = request.body;

	const newCredential = await Credential.create({
		userId: request.user._id,
		credentialType,
		displayName,
		emailId,
		host,
		port,
		user,
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
	const { name, subject, salutation, body, closing, signature, tags } = request.body;

	const newEmailTemplate = await EmailTemplate.create({ userId: request.user._id, name, subject, salutation, body, closing, signature, tags });

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
	const { from, to, subject, salutation, body, closing, signature, dateTimeLocal, receiveConfirmationEmail } = request.body;

	const targetDateAndTime = new Date(dateTimeLocal);
	const delay = Number(targetDateAndTime) - Number(new Date());

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

	if (!credential) {
		next(new ApiError(MESSAGES.USER.EMAIL_SCHEDULED_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	const html = `<p>\
									<b>SALUTATION:</b> ${salutation}<br/>\
									<b>BODY:</b><pre>${body}</pre><br/>\
									<b>CLOSING:</b> ${closing}<br/>\
									<b>SIGNATURE:</b> ${signature}<br/>\
									<b>DATE:</b>	${targetDateAndTime.toString()}<br/>\
									<b>DATE TIME LOCAL:</b>	${dateTimeLocal}\
								</p>`;

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
		emailType: constants.EMAIL_TYPES.USER,
	};
	await emailQueue.add(constants.MESSAGING_QUEUES.EMAIL, data, { delay });

	response.json(new ApiResponse(MESSAGES.BULL_MQ.EMAIL.EMAIL_SCHEDULED_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
});

export const userController = {
	addNewCredential,
	addNewEmailTemplate,
	deleteCredential,
	deleteEmailTemplate,
	getCredential,
	getCredentialList,
	getEmailTemplate,
	getEmailTemplateList,
	patchCredential,
	patchEmailTemplate,
	postEmail,
};
