import { Router } from 'express';

import { mailController } from '@apiV1Controllers';

export const mailRouter = Router();

mailRouter.post('/send', mailController.sendMail);
