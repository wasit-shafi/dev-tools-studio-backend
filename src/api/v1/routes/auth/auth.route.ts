import { Router } from 'express';

import { authController } from '@apiV1Controllers';
import { apiRateLimiterStrict, validateReCaptchaResponse, validateRequestBody, verifyAccessToken, verifyRefreshToken } from '@middlewares';
import * as schemas from '@schemas';
import * as constants from '@utils/constants';

export const authRouter = Router();
// signup

authRouter.post(constants.ROUTES.AUTH_ROUTES._SIGNUP, validateRequestBody(schemas.signupZodSchema), validateReCaptchaResponse, authController.signup);
// signin

authRouter.post(constants.ROUTES.AUTH_ROUTES._SIGNIN, validateReCaptchaResponse, authController.signin);
// get user details by providing access token only

authRouter.get(constants.ROUTES.AUTH_ROUTES._ME, verifyAccessToken, authController.getMe);
// getting user details and new access/refresh token only if the current refresh token is valid

authRouter.post(constants.ROUTES.AUTH_ROUTES._REFRESH, verifyRefreshToken, authController.refresh);
// signout

authRouter.post(constants.ROUTES.AUTH_ROUTES._SIGNOUT, verifyAccessToken, authController.signout);
// forgot password

authRouter.post(constants.ROUTES.AUTH_ROUTES._FORGOT_PASSWORD, apiRateLimiterStrict, validateReCaptchaResponse, authController.forgotPassword);
// reset password

authRouter.patch(
	`${constants.ROUTES.AUTH_ROUTES._RESET_PASSWORD}/:token`,
	apiRateLimiterStrict,
	validateRequestBody(schemas.resetPasswordZodSchema),
	validateReCaptchaResponse,
	authController.resetPassword
);
