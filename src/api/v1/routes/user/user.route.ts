import { Router } from 'express';

import { userController } from '@apiV1Controllers';
import * as constants from '@utils/constants';

export const userRouter = Router();
// Credential

userRouter.post(constants.ROUTES.USER_ROUTES.CREDENTIAL, userController.addNewCredential);

userRouter.route(`${constants.ROUTES.USER_ROUTES.CREDENTIAL}/:_id`).get(userController.getCredential).patch(userController.patchCredential).delete(userController.deleteCredential);
// Credential List

userRouter.get(constants.ROUTES.USER_ROUTES.CREDENTIAL_LIST, userController.getCredentialList);
// Email Template

userRouter.post(constants.ROUTES.USER_ROUTES.EMAIL_TEMPLATE, userController.addNewEmailTemplate);

userRouter
	.route(`${constants.ROUTES.USER_ROUTES.EMAIL_TEMPLATE}/:_id`)
	.get(userController.getEmailTemplate)
	.patch(userController.patchEmailTemplate)
	.delete(userController.deleteEmailTemplate);
// Email Template List

userRouter.get(constants.ROUTES.USER_ROUTES.EMAIL_TEMPLATE_LIST, userController.getEmailTemplateList);
// Email

userRouter.post(constants.ROUTES.USER_ROUTES.EMAIL, userController.postEmail);
