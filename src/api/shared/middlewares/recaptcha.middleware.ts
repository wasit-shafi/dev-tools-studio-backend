import { NextFunction, Request, RequestHandler, Response } from 'express';

import { _env } from '@environment';
import { IReCaptchaSiteVerifyResponse } from '@interfaces';
import { ApiError, asyncHandler, messages } from '@utils';
import * as constants from '@utils/constants';

export const validateReCaptchaResponse: RequestHandler = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
	if (!('reCaptchaResponse' in request.body)) {
		next(new ApiError(messages.AUTH.RE_CAPTCHA_NOT_PROVIDED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	const { reCaptchaResponse } = request.body;

	if (!reCaptchaResponse) {
		next(new ApiError(messages.AUTH.RE_CAPTCHA_RESPONSE_EMPTY, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		return;
	}

	if (_env.get('NODE_ENV') == constants.NODE_ENV.DEVELOPMENT) {
		next();
		return;
	}

	// Create a new URLSearchParams object
	const reCaptchaParams = new URLSearchParams({
		secret: _env.get('RECAPTCHA_SECRET_KEY') as string,
		response: reCaptchaResponse,
		remoteip: request.ip as string,
	});

	const recaptchaSiteVerifyResponse = await fetch(`${constants.RE_CAPTCHA_SITE_VERIFY_BASE_URL}?${reCaptchaParams}`, {
		method: 'POST',
	});

	const data: IReCaptchaSiteVerifyResponse = await recaptchaSiteVerifyResponse.json();

	// console.log({ data, reCaptchaParams });

	if (!data.success) {
		next(new ApiError(messages.AUTH.RE_CAPTCHA_FAILED, constants.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED));
		return;
	}

	next();
});
