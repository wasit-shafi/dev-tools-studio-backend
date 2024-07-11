import { Router } from 'express';

import { mailController } from '../../controllers';

export const mailRouter = Router();

mailRouter.post('/send', mailController.sendMail);
