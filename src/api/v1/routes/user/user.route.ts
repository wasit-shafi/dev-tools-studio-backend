import { Router } from 'express';

import { getUsers, registerUser } from '../../controllers/user/user.controller';

export const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.post('/register', registerUser);
