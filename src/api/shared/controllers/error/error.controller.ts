import type { ErrorRequestHandler } from 'express';

import * as constants from '@utils/constants';

const globalErrorController: ErrorRequestHandler = (error, _, response, next) => {
	error.code = error.code || constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
	error.status = error.status || constants.STATUS_TYPES.ERROR;
	error.data = error?.data || {};

	response.status(error.code).json({
		code: error.code,
		data: error.data,
		message: error.message,
		status: error.status,
		success: false,
	});
};

export { globalErrorController };
