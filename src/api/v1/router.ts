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
	// console.log('Visitor Alert Request Body:', request.body);
	if (_env.get('NODE_ENV') == constants.NODE_ENV.PRODUCTION) {
		const when = new Date().toUTCString();
		const device = utils.getDeviceInfoString(request.headers['user-agent'] || '');
		// const near = utils.getIpInfoString(request.ipInfo);
		const timeInIndia = new Date().toLocaleString('en-GB', { hour12: true, hourCycle: 'h12', dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Kolkata' });

		const emailOptions: IEmailOptions = {
			from: `${_env.get('EMAIL_SERVICE_SENDER_NAME')}<${_env.get('EMAIL_SERVICE_SENDER_EMAIL_ID')}>`,
			to: _env.get('VISITOR_ALERT_RECEIVER_EMAIL_ID'),
			subject: `VA - ${device}`,
			html: `<pre>${JSON.stringify(request.body.ipInfoFromClient, null, 2)}</pre><br/>Device: ${device}<br/>When: ${when} <br/><br/>Time on Client Machine: ${request.body.timeOnClientMachine}<br/>Time Zone on Client Machine: ${request.body.timeZoneOnClientMachine} <br/><br/>Time in India: ${timeInIndia}`,
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
