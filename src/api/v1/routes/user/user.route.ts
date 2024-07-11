import { Router } from 'express';

import { userController } from '../../controllers/user/user.controller';
import { userZodSchema } from '../../../shared/schema/user/user.schema';

import { validate } from '../../../shared/middlewares/validate.middleware';

export const userRouter = Router();

userRouter.get('/', userController.getUsers);

userRouter.post('/register', validate(userZodSchema), userController.registerUser);
