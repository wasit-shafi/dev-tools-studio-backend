import { Router } from 'express';

import { userController } from '@apiV1Controllers/user/user.controller';
import { userZodSchema } from '../../../shared/schemas/user/user.schema';

import { validate } from '../../../shared/middlewares/validate.middleware';

import * as constants from '@utils/constants';

export const userRouter = Router();

userRouter.get('/', userController.getUsers);
