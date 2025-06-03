import type { ErrorRequestHandler } from 'express';

import multer from 'multer';

import { _env } from '@environment';
import { MESSAGES } from '@utils';
import * as constants from '@utils/constants';

export const globalErrorController: ErrorRequestHandler = (error, _, response, next) => {
	let code: number = error.code ?? constants.HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR;
	let message: string = error.message ?? MESSAGES.SHARED.SOMETHING_WENT_WRONG;
	const data: unknown = error?.data ?? null;

	if (_env.get('NODE_ENV') === constants.NODE_ENV.DEVELOPMENT) {
		console.log('globalErrorController :: error ::', error);
	}
	// NOTE(Wasit): the 'code' property incase of multer errors will be string

	if (error instanceof multer.MulterError) {
		code = constants.HTTP_STATUS_CODES.CLIENT_ERROR.PAYLOAD_TOO_LARGE;
		message = MESSAGES.SHARED.FILE_UPLOAD_ERROR;

		if (error.code === 'LIMIT_FILE_SIZE') {
			message = MESSAGES.SHARED.LIMIT_FILE_SIZE_ERROR;
		}
	}

	response.status(code).json({
		success: false,
		code,
		message,
		data,
	});
};
