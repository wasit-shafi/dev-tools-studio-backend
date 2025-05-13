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

const deleteCredential: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	try {
		const credential = await Credential.findOneAndDelete({ userId: request.user._id, _id: request.params._id });

		if (!credential) {
			next(new ApiError(MESSAGES.USER.DELETE_CREDENTIAL_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
			return;
		}

		response.status(constants.HTTP_STATUS_CODES.SUCCESSFUL.OK).json(new ApiResponse(MESSAGES.USER.DELETE_CREDENTIAL_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK));
	} catch (error: any) {
		next(new ApiError(MESSAGES.USER.DELETE_CREDENTIAL_FAILURE, constants.HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR));
	}
};

const patchCredential: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	try {
		const updatedCredential = await Credential.findOneAndUpdate({ userId: request.user._id, _id: request.params._id }, { ...request.body }, { new: true })
			.select('-userId -__v')
			.lean();

		if (!updatedCredential) {
			next(new ApiError(MESSAGES.USER.PATCH_CREDENTIAL_FAILURE, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_FOUND));
			return;
		}

		response.json(new ApiResponse(MESSAGES.USER.PATCH_CREDENTIAL_SUCCESS, constants.HTTP_STATUS_CODES.SUCCESSFUL.OK, { ...updatedCredential }));
	} catch (error) {
		next(new ApiError(MESSAGES.USER.PATCH_CREDENTIAL_FAILURE, constants.HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR));
	}
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
	deleteCredential,
	getCredential,
	getCredentialList,
	patchCredential,
};
