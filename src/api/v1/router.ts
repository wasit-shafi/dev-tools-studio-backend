import { Router } from 'express';
import { userRouter } from './routes';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: 'Hello World - V1' }).send();
});

router.use('/user', userRouter);

export const routerV1 = router;
