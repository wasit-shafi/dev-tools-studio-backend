import { Request, Response, Router } from 'express';

import { getHeadersForAvoidEmailGrouping } from '@api/shared/utils';
import { _env } from '@environment';
import { IEmailOptions } from '@interfaces';
import { emailQueue } from '@messageQueue';
import { verifyAccessToken } from '@middlewares';
import * as constants from '@utils/constants';
import * as utils from '@utils/utils';

import { authRouter, userRouter } from './routes';

const router = Router();

router.get('/say-hello', (request, response) => {
	response.json({ message: `Hello World - V1(${_env.get('NODE_ENV')})` });
});

router.post('/visitor-alert', async (request: Request, response: Response) => {
	if (_env.get('NODE_ENV') == constants.NODE_ENV.PRODUCTION) {
		const when = new Date().toUTCString();
		const device = utils.getDeviceInfoString(request.headers['user-agent'] || '');
		// const near = utils.getIpInfoString(request.ipInfo);

		const emailOptions: IEmailOptions = {
			from: `${_env.get('EMAIL_SERVICE_SENDER_NAME')}<${_env.get('EMAIL_SERVICE_SENDER_EMAIL_ID')}>`,
			to: _env.get('VISITOR_ALERT_RECEIVER_EMAIL_ID'),
			subject: 'Visitor Alert - Dev Tools Studio',
			html: `Someone just visited the Dev Tools Studio  <br/>WHEN: <b>${when}</b><br/>DEVICE: <b>${device}</b>`,
			headers: { ...getHeadersForAvoidEmailGrouping() },
		};

		await emailQueue.add(constants.MESSAGING_QUEUES.EMAIL, {
			emailOptions,
			emailType: constants.EMAIL_TYPES.APPLICATION,
		});
	}

	response.json({ message: 'Thanks for visiting the Dev Tools Studio Project' });
});

router.use(constants.ROUTES._USER, verifyAccessToken, userRouter);

router.use(constants.ROUTES._AUTH, authRouter);

export const routerV1 = router;
