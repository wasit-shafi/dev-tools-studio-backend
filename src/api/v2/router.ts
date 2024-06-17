import { Router } from 'express';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: 'Hello World - V2' }).send();
});

export const routerV2 = router;
