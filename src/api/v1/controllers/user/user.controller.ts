import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { _env } from '@environment';
import { Credential, User } from '@models';
import { ApiError, ApiResponse, asyncHandler, MESSAGES } from '@utils';
import * as constants from '@utils/constants';

const addNewCredential: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	const { credentialType, emailId, host, port, user, pass } = request.body;

	const newCredential = await Credential.create({
		userId: request.user._id,
		credentialType,
		emailId,
		host,
		port,
		user,
		pass,
	});

	response.json(new ApiResponse(MESSAGES.USER.ADD_CREDENTIAL_SUCCESS, constants.HTTP_STATUS_CODES.INFORMATIONAL.CREATED, { _id: newCredential._id }));
};

const getCredential: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	const credential = await Credential.findOne({ userId: request.user._id, _id: request.params._id }).select('-userId -__v');

	if (!credential) {
		next(new ApiError(MESSAGES.USER.GET_CREDENTIAL_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	response.json(new ApiResponse(MESSAGES.USER.GET_CREDENTIAL_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { credential }));
};

const getCredentialList: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	const credentialList = await Credential.find({ userId: request.user._id }).select('-userId -__v');

	response
		.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK)
		.json(new ApiResponse(MESSAGES.USER.GET_CREDENTIAL_LIST_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { credentialList }));
};

const addNewEmailTemplate: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	response.json(new ApiResponse(MESSAGES.USER.ADD_EMAIL_TEMPLATE_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.CREATED, { _id: '123abc' }));
};

export const userController = {
	addNewCredential,
	addNewEmailTemplate,
	getCredential,
	getCredentialList,
};
