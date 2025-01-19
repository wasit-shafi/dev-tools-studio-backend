import { Router } from 'express';

import { authController } from '@apiV1Controllers/auth/auth.controller';
import { _env } from '@environment';
import { validate, validateReCaptchaResponse } from '@middlewares';
import { resetPasswordZodSchema, signupZodSchema } from '@schemas';
import { apiRateLimiterStrict } from '@utils';
import * as constants from '@utils/constants';

export const authRouter = Router();

//
authRouter.post(constants.ROUTES.AUTH_ROUTES._SIGNUP, validate(signupZodSchema), validateReCaptchaResponse, authController.signup);

authRouter.post(constants.ROUTES.AUTH_ROUTES._SIGNIN, validateReCaptchaResponse, authController.signin);

authRouter.post(constants.ROUTES.AUTH_ROUTES._SIGNOUT, authController.signout);

authRouter.post(
	constants.ROUTES.AUTH_ROUTES._FORGOT_PASSWORD,
	apiRateLimiterStrict,
	validateReCaptchaResponse,
	authController.forgotPassword
);

authRouter.patch(
	`${constants.ROUTES.AUTH_ROUTES._RESET_PASSWORD}/:token`,
	apiRateLimiterStrict,
	validate(resetPasswordZodSchema),
	validateReCaptchaResponse,
	authController.resetPassword
);
