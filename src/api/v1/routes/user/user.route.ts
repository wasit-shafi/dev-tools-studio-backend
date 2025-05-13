import { Router } from 'express';

import { userController } from '@apiV1Controllers';
import * as constants from '@utils/constants';

export const userRouter = Router();
// Credential

userRouter.post(constants.ROUTES.USER_ROUTES.CREDENTIAL, userController.addNewCredential);
userRouter.get(`${constants.ROUTES.USER_ROUTES.CREDENTIAL}/:_id`, userController.getCredential);
userRouter.patch(`${constants.ROUTES.USER_ROUTES.CREDENTIAL}/:_id`, userController.patchCredential);
userRouter.delete(`${constants.ROUTES.USER_ROUTES.CREDENTIAL}/:_id`, userController.deleteCredential);
// Credential List

userRouter.get(constants.ROUTES.USER_ROUTES.CREDENTIAL_LIST, userController.getCredentialList);
// Email Template

userRouter.post(constants.ROUTES.USER_ROUTES.EMAIL_TEMPLATE, userController.addNewEmailTemplate);
