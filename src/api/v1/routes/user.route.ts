import { Router } from 'express';
import { getUsers, registerUser } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/register', registerUser);
