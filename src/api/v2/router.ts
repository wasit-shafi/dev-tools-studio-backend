import { Router } from 'express';

import { _env } from '@environment';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: `Hello World - V2(${_env.get('NODE_ENV')})` });
});

export const routerV2 = router;
