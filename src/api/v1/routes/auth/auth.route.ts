import { Router } from 'express';

import { authController } from '@apiV1Controllers/auth/auth.controller';

import { validate } from '@middlewares/validate.middleware';
import { userZodSchema } from '@schemas/user/user.schema';

import * as constants from '@utils/constants';

import { _env } from '@environment';

export const authRouter = Router();

authRouter.post(constants.ROUTES.AUTH_ROUTER.SIGNUP, validate(userZodSchema), authController.signup);

authRouter.post(constants.ROUTES.AUTH_ROUTER.SIGNIN, authController.signin);

authRouter.post(constants.ROUTES.AUTH_ROUTER.SIGNOUT, authController.signout);

authRouter.post(constants.ROUTES.AUTH_ROUTER.RESET_PASSWORD, authController.resetPassword);
