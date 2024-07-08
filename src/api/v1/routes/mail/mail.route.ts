import { Router } from 'express';
import { sendMail } from '../../controllers';

export const mailRouter = Router();

mailRouter.post('/send', sendMail);
