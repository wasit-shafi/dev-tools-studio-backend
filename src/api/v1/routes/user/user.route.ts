import { Router } from 'express';

import { userController } from '@apiV1Controllers/user/user.controller';

export const userRouter = Router();

userRouter.get('/', userController.getUsers);
