import { Router } from 'express';

import { authController } from '@apiV1Controllers/auth/auth.controller';

import { userZodSchema } from '@schemas/user/user.schema';
import { validate, validateReCaptchaResponse } from '@middlewares';

import { _env } from '@environment';
import { apiRateLimiterStrict } from '@utils';
import * as constants from '@utils/constants';

export const authRouter = Router();

authRouter.post(constants.ROUTES.AUTH_ROUTER.SIGNUP, validate(userZodSchema), authController.signup);

authRouter.post(constants.ROUTES.AUTH_ROUTER.SIGNIN, validateReCaptchaResponse, authController.signin);

authRouter.post(constants.ROUTES.AUTH_ROUTER.SIGNOUT, authController.signout);

authRouter.post(constants.ROUTES.AUTH_ROUTER.RESET_PASSWORD, apiRateLimiterStrict, authController.resetPassword);
