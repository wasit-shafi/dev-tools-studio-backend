import type { ErrorRequestHandler } from 'express';

import * as constants from '@utils/constants';

export const globalErrorController: ErrorRequestHandler = (error, _, response, next) => {
	// console.log('globalErrorController :: ', error);

	error.code = error.code || constants.HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR;
	// error.status = error.status || constants.STATUS_TYPES.ERROR;
	error.data = error?.data || null;

	response.status(error.code).json({
		code: error.code,
		data: error.data,
		message: error.message,
		// status: error.status,
		success: false,
	});
	return;
};
