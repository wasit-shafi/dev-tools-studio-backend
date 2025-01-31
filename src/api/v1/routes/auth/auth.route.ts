import { Router } from 'express';

import { authController } from '@apiV1Controllers/auth/auth.controller';
import { validateReCaptchaResponse, validateRequestBody } from '@middlewares';
import * as schemas from '@schemas';
import { apiRateLimiterStrict } from '@utils';
import * as constants from '@utils/constants';

export const authRouter = Router();

authRouter.post(
	constants.ROUTES.AUTH_ROUTES._SIGNUP,
	validateRequestBody(schemas.signupZodSchema),
	validateReCaptchaResponse,
	authController.signup
);

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
	validateRequestBody(schemas.resetPasswordZodSchema),
	validateReCaptchaResponse,
	authController.resetPassword
);
