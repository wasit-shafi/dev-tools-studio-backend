import { Router } from 'express';
import { registerUser } from '../../controllers/main/user.controller';

export const userRouter = Router();

userRouter.get('/register', registerUser);
