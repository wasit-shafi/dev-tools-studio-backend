import { Router } from 'express';
import { userRouter } from './main/user.route';

export const mainRouter = Router();

// main router includes only all the v1 api's

mainRouter.use('/user', userRouter);
