import { Router } from 'express';

import { authController } from '@apiV1Controllers/auth/auth.controller';

import { userZodSchema } from '@schemas/user/user.schema';
import { validate, validateReCaptchaResponse } from '@middlewares';

import { _env } from '@environment';
import { apiRateLimiterStrict } from '@utils';
import * as constants from '@utils/constants';

export const authRouter = Router();

authRouter.post(constants.ROUTES.AUTH_ROUTES.SIGNUP, validateReCaptchaResponse, validate(userZodSchema), authController.signup);

authRouter.post(constants.ROUTES.AUTH_ROUTES.SIGNIN, validateReCaptchaResponse, authController.signin);

authRouter.post(constants.ROUTES.AUTH_ROUTES.SIGNOUT, authController.signout);

authRouter.post(constants.ROUTES.AUTH_ROUTES.RESET_PASSWORD, apiRateLimiterStrict, validateReCaptchaResponse, authController.resetPassword);
