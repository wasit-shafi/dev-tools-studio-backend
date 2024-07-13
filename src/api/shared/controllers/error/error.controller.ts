import type { ErrorRequestHandler } from 'express';

import { HTTP_STATUS_CODES, STATUS_TYPES } from '@utils';

const globalErrorController: ErrorRequestHandler = (error, _, response, next) => {
	error.statusCode = error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
	error.status = error.status || STATUS_TYPES.ERROR;

	response.status(error.statusCode).json({
		status: error.status,
		statusCode: error.statusCode,
		message: error.message,
	});
};

export { globalErrorController };
