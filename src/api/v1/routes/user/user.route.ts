import { Router } from 'express';

import { userController } from '@apiV1Controllers/user/user.controller';
import * as constants from '@utils/constants';

export const userRouter = Router();

userRouter.post(constants.ROUTES.USER_ROUTES.CREDENTIAL, userController.addNewCredential);
userRouter.get(`${constants.ROUTES.USER_ROUTES.CREDENTIAL}/:_id`, userController.getCredential);
userRouter.get(constants.ROUTES.USER_ROUTES.CREDENTIAL_LIST, userController.getCredentialList);

userRouter.post(constants.ROUTES.USER_ROUTES.EMAIL_TEMPLATE, userController.addNewEmailTemplate);
