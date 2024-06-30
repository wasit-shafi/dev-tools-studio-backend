import { Router } from 'express';

import { getUsers, registerUser } from '../../controllers/user/user.controller';

import { userZodSchema } from '../../../shared/schema/user/user.schema';

import { validate } from '../../../shared/middlewares/validate.middleware';

export const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.post('/register', validate(userZodSchema), registerUser);
