import { Router } from 'express';

import { mailController } from '@v1Controllers';

export const mailRouter = Router();

mailRouter.post('/send', mailController.sendMail);
