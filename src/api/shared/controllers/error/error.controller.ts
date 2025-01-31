import type { ErrorRequestHandler } from 'express';

import { _env } from '@config/environment';
import { MESSAGES } from '@utils';
import * as constants from '@utils/constants';

export const globalErrorController: ErrorRequestHandler = (error, _, response, next) => {
	if (_env.get('NODE_ENV') === constants.NODE_ENV.DEVELOPMENT) {
		console.log('globalErrorController :: error ::', error);
	}

	const code: number = error.code ?? constants.HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR;
	const message: string = error.message ?? MESSAGES.SHARED.SOMETHING_WENT_WRONG;
	const data: unknown = error?.data ?? null;

	response.status(code).json({
		success: false,
		code,
		message,
		data,
	});
};
