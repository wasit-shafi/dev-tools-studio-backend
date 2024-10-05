import { ApiError, asyncHandler } from '@utils';

import { type Request, Response, RequestHandler, NextFunction } from 'express';

import { _env } from '@environment';
import * as constants from '@utils/constants';
import { IReCaptchaSiteVerifyResponse } from '@interfaces';

export const validateReCaptchaResponse: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	const { reCaptchaResponse } = request.body;

	if (!reCaptchaResponse) {
		next(
			new ApiError(
				"ReCaptcha response can't be empty. Please check the checkbox again",
				constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST
			)
		);
		return;
	}

	// Create a new URLSearchParams object
	const reCaptchaParams = new URLSearchParams({
		secret: _env.get('RECAPTCHA_SECRET_KEY') as string,
		response: reCaptchaResponse,
		remoteip: request.ip as string,
	});

	const recaptchaSiteVerifyResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?${reCaptchaParams}`, {
		method: 'POST',
	});

	const data: IReCaptchaSiteVerifyResponse = await recaptchaSiteVerifyResponse.json();

	// console.log({ data, reCaptchaParams });

	if (!data.success) {
		next(new ApiError('reCAPTCHA verification failed', constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
		return;
	}

	next();
});
